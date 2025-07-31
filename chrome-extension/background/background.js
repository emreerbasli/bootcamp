// MeetAI Background Script - Service Worker
class MeetAIBackground {
    constructor() {
        this.sessions = new Map(); // Aktif oturumlar
        this.backendStatus = 'unknown';
        this.lastHealthCheck = 0;
        
        // Event listener'ları başlat
        this.init();
    }

    init() {
        console.log('MeetAI Background Script başlatılıyor...');

        // Extension yüklendiğinde
        chrome.runtime.onStartup.addListener(() => {
            this.onStartup();
        });

        chrome.runtime.onInstalled.addListener((details) => {
            this.onInstalled(details);
        });

        // Tab güncellemeleri
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            this.onTabUpdated(tabId, changeInfo, tab);
        });

        // Tab kapatıldığında
        chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
            this.onTabRemoved(tabId);
        });

        // Extension mesajları
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
            return true; // Async response için
        });

        // Periyodik backend sağlık kontrolü
        this.startHealthCheck();

        console.log('MeetAI Background Script hazır');
    }

    onStartup() {
        console.log('Chrome başlatıldı, MeetAI hazır');
        this.checkBackendHealth();
    }

    onInstalled(details) {
        console.log('MeetAI kurulumu:', details.reason);
        
        if (details.reason === 'install') {
            // İlk kurulum
            this.showWelcomeNotification();
            this.openOnboardingPage();
        } else if (details.reason === 'update') {
            // Güncelleme
            this.handleUpdate(details.previousVersion);
        }
    }

    onTabUpdated(tabId, changeInfo, tab) {
        // Desteklenen toplantı platformlarını kontrol et
        if (changeInfo.status === 'complete' && tab.url) {
            const supportedPlatforms = [
                'meet.google.com',
                'zoom.us',
                'teams.microsoft.com'
            ];

            const isSupported = supportedPlatforms.some(platform => 
                tab.url.includes(platform)
            );

            if (isSupported) {
                // Badge göster
                this.updateBadge(tabId, 'ready');
                
                // Session başlat
                this.initializeSession(tabId, tab);
            } else {
                // Badge'i temizle
                this.updateBadge(tabId, 'inactive');
            }
        }
    }

    onTabRemoved(tabId) {
        // Session temizle
        if (this.sessions.has(tabId)) {
            const session = this.sessions.get(tabId);
            if (session.isRecording) {
                console.log(`Tab ${tabId} kapatıldı, kayıt durduruluyor`);
            }
            this.sessions.delete(tabId);
        }
    }

    handleMessage(message, sender, sendResponse) {
        const tabId = sender.tab?.id;

        switch (message.action) {
            case 'startSession':
                this.startSession(tabId, message.data)
                    .then(result => sendResponse(result))
                    .catch(error => sendResponse({ success: false, error: error.message }));
                break;

            case 'stopSession':
                this.stopSession(tabId)
                    .then(result => sendResponse(result))
                    .catch(error => sendResponse({ success: false, error: error.message }));
                break;

            case 'getSessionStatus':
                const session = this.sessions.get(tabId);
                sendResponse({
                    success: true,
                    data: {
                        isActive: !!session,
                        isRecording: session?.isRecording || false,
                        startTime: session?.startTime || null,
                        platform: session?.platform || 'unknown'
                    }
                });
                break;

            case 'updateSession':
                this.updateSession(tabId, message.data);
                sendResponse({ success: true });
                break;

            case 'getBackendStatus':
                sendResponse({
                    success: true,
                    status: this.backendStatus,
                    lastCheck: this.lastHealthCheck
                });
                break;

            case 'checkBackendHealth':
                this.checkBackendHealth()
                    .then(status => sendResponse({ success: true, status }))
                    .catch(error => sendResponse({ success: false, error: error.message }));
                break;

            default:
                sendResponse({ success: false, error: 'Bilinmeyen aksiyon' });
        }
    }

    async startSession(tabId, data) {
        try {
            if (!tabId) {
                throw new Error('Tab ID bulunamadı');
            }

            // Mevcut session kontrolü
            if (this.sessions.has(tabId)) {
                const existingSession = this.sessions.get(tabId);
                if (existingSession.isRecording) {
                    throw new Error('Bu tab\'da zaten aktif bir kayıt var');
                }
            }

            // Yeni session oluştur
            const session = {
                tabId: tabId,
                startTime: Date.now(),
                platform: data.platform || 'unknown',
                isRecording: false,
                transcriptCount: 0,
                summaryCount: 0,
                errors: []
            };

            this.sessions.set(tabId, session);

            // Badge güncelle
            this.updateBadge(tabId, 'active');

            console.log(`Session başlatıldı - Tab: ${tabId}, Platform: ${session.platform}`);

            return {
                success: true,
                sessionId: tabId,
                data: session
            };

        } catch (error) {
            console.error('Session başlatma hatası:', error);
            throw error;
        }
    }

    async stopSession(tabId) {
        try {
            if (!this.sessions.has(tabId)) {
                throw new Error('Aktif session bulunamadı');
            }

            const session = this.sessions.get(tabId);
            session.endTime = Date.now();
            session.isRecording = false;

            // Session verilerini kaydet (gelecek özellik)
            await this.saveSessionData(session);

            // Session'ı temizle
            this.sessions.delete(tabId);

            // Badge güncelle
            this.updateBadge(tabId, 'ready');

            console.log(`Session durduruldu - Tab: ${tabId}`);

            return {
                success: true,
                sessionData: session
            };

        } catch (error) {
            console.error('Session durdurma hatası:', error);
            throw error;
        }
    }

    updateSession(tabId, data) {
        if (!this.sessions.has(tabId)) return;

        const session = this.sessions.get(tabId);
        
        // Session verilerini güncelle
        Object.assign(session, data);

        // Badge durumunu güncelle
        if (data.isRecording !== undefined) {
            this.updateBadge(tabId, data.isRecording ? 'recording' : 'active');
        }

        // İstatistikleri güncelle
        if (data.transcriptReceived) {
            session.transcriptCount = (session.transcriptCount || 0) + 1;
        }

        if (data.summaryReceived) {
            session.summaryCount = (session.summaryCount || 0) + 1;
        }

        if (data.error) {
            session.errors = session.errors || [];
            session.errors.push({
                timestamp: Date.now(),
                error: data.error
            });
        }

        console.log(`Session güncellendi - Tab: ${tabId}`, data);
    }

    initializeSession(tabId, tab) {
        // Platform tespiti
        let platform = 'unknown';
        
        if (tab.url.includes('meet.google.com')) {
            platform = 'google-meet';
        } else if (tab.url.includes('zoom.us')) {
            platform = 'zoom';
        } else if (tab.url.includes('teams.microsoft.com')) {
            platform = 'teams';
        }

        // Session bilgilerini hazırla
        const sessionInfo = {
            tabId: tabId,
            url: tab.url,
            title: tab.title,
            platform: platform,
            detectedTime: Date.now()
        };

        console.log('Platform algılandı:', sessionInfo);
    }

    updateBadge(tabId, status) {
        const badgeConfigs = {
            'inactive': { text: '', color: '#999999' },
            'ready': { text: '●', color: '#4CAF50' },
            'active': { text: '●', color: '#2196F3' },
            'recording': { text: '●', color: '#F44336' },
            'error': { text: '!', color: '#FF9800' }
        };

        const config = badgeConfigs[status] || badgeConfigs['inactive'];

        chrome.action.setBadgeText({
            text: config.text,
            tabId: tabId
        });

        chrome.action.setBadgeBackgroundColor({
            color: config.color,
            tabId: tabId
        });
    }

    async checkBackendHealth() {
        try {
            const response = await fetch('http://localhost:3000/api/health', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.backendStatus = 'online';
                this.lastHealthCheck = Date.now();
                
                console.log('Backend sağlık kontrolü: OK');
                return 'online';
            } else {
                throw new Error(`HTTP ${response.status}`);
            }

        } catch (error) {
            console.warn('Backend sağlık kontrolü başarısız:', error.message);
            this.backendStatus = 'offline';
            this.lastHealthCheck = Date.now();
            return 'offline';
        }
    }

    startHealthCheck() {
        // İlk kontrol
        this.checkBackendHealth();

        // Her 30 saniyede bir kontrol et
        setInterval(() => {
            this.checkBackendHealth();
        }, 30000);
    }

    async saveSessionData(session) {
        try {
            // Local storage'a kaydet
            const sessionKey = `session_${session.tabId}_${session.startTime}`;
            const sessionData = {
                ...session,
                saved: Date.now()
            };

            await chrome.storage.local.set({
                [sessionKey]: sessionData
            });

            console.log('Session verileri kaydedildi:', sessionKey);

        } catch (error) {
            console.error('Session kaydetme hatası:', error);
        }
    }

    showWelcomeNotification() {
        chrome.notifications.create('meetai-welcome', {
            type: 'basic',
            iconUrl: '/icons/icon48.png',
            title: 'MeetAI Hoş Geldiniz!',
            message: 'Toplantı asistanınız hazır. Google Meet, Zoom veya Teams\'e katılın.'
        });
    }

    openOnboardingPage() {
        chrome.tabs.create({
            url: 'popup/popup.html',
            active: true
        });
    }

    handleUpdate(previousVersion) {
        console.log(`MeetAI güncellendi: ${previousVersion} -> ${chrome.runtime.getManifest().version}`);
        
        // Güncelleme bildirimi
        chrome.notifications.create('meetai-updated', {
            type: 'basic',
            iconUrl: '/icons/icon48.png',
            title: 'MeetAI Güncellendi',
            message: 'Yeni özellikler ve iyileştirmeler mevcut!'
        });
    }

    // Utility fonksiyonlar
    getAllSessions() {
        return Array.from(this.sessions.values());
    }

    getActiveSessionsCount() {
        return Array.from(this.sessions.values()).filter(s => s.isRecording).length;
    }

    getSessionById(tabId) {
        return this.sessions.get(tabId) || null;
    }

    // Debug bilgileri
    getDebugInfo() {
        return {
            backendStatus: this.backendStatus,
            lastHealthCheck: this.lastHealthCheck,
            activeSessions: this.sessions.size,
            recordingSessions: this.getActiveSessionsCount(),
            sessions: this.getAllSessions()
        };
    }
}

// Background script başlat
const meetAIBackground = new MeetAIBackground();

// Global erişim (debug için)
globalThis.meetAIBackground = meetAIBackground; 