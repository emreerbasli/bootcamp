// MeetAI Popup JavaScript
class MeetAIPopup {
    constructor() {
        this.isRecording = false;
        this.connectionStatus = 'connecting';
        this.transcriptData = '';
        this.summaryData = '';
        this.confidenceLevel = 0;
        
        // DOM elementleri
        this.elements = {};
        
        // Event listeners'ı başlat
        this.init();
    }

    init() {
        // DOM hazır olduğunda çalıştır
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupElements());
        } else {
            this.setupElements();
        }
    }

    setupElements() {
        // DOM elementlerini al
        this.elements = {
            startBtn: document.getElementById('startBtn'),
            stopBtn: document.getElementById('stopBtn'),
            statusText: document.getElementById('statusText'),
            statusDot: document.querySelector('.status-dot'),
            recordingIndicator: document.getElementById('recordingIndicator'),
            transcriptBox: document.getElementById('transcriptBox'),
            summaryBox: document.getElementById('summaryBox'),
            confidenceIndicator: document.getElementById('confidenceIndicator'),
            updateTimer: document.getElementById('updateTimer'),
            connectionStatus: document.getElementById('connectionStatus'),
            connectionDot: document.querySelector('.connection-dot'),
            connectionText: document.querySelector('.connection-text'),
            loadingOverlay: document.getElementById('loadingOverlay'),
            exportBtn: document.getElementById('exportBtn'),
            settingsBtn: document.getElementById('settingsBtn'),
            qaBtn: document.getElementById('qaBtn')
        };

        // Event listeners ekle
        this.setupEventListeners();
        
        // Backend bağlantısını kontrol et
        this.checkBackendConnection();
        
        // Sayfa yüklendiğinde mevcut durumu kontrol et
        this.checkCurrentState();
    }

    setupEventListeners() {
        // Ana kontrol düğmeleri
        this.elements.startBtn.addEventListener('click', () => this.startRecording());
        this.elements.stopBtn.addEventListener('click', () => this.stopRecording());
        
        // Hızlı aksiyon düğmeleri
        this.elements.exportBtn.addEventListener('click', () => this.exportData());
        this.elements.settingsBtn.addEventListener('click', () => this.openSettings());
        this.elements.qaBtn.addEventListener('click', () => this.openQABot());

        // Chrome extension mesajlarını dinle
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
        });
    }

    async startRecording() {
        try {
            this.showLoading('Kayıt başlatılıyor...');
            
            // Aktif tab'ı al
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab) {
                throw new Error('Aktif tab bulunamadı');
            }

            // Desteklenen platform kontrolü
            const supportedPlatforms = ['meet.google.com', 'zoom.us', 'teams.microsoft.com'];
            const currentUrl = new URL(tab.url);
            const isSupported = supportedPlatforms.some(platform => 
                currentUrl.hostname.includes(platform)
            );

            if (!isSupported) {
                throw new Error('Bu platform desteklenmiyor. Lütfen Google Meet, Zoom veya Teams kullanın.');
            }

            // Content script'e başlat mesajı gönder
            await chrome.tabs.sendMessage(tab.id, { 
                action: 'startRecording',
                timestamp: Date.now()
            });

            // UI güncellemeleri
            this.updateRecordingState(true);
            this.hideLoading();
            
        } catch (error) {
            this.showError('Kayıt başlatılamadı: ' + error.message);
            this.hideLoading();
        }
    }

    async stopRecording() {
        try {
            this.showLoading('Kayıt durduruluyor...');
            
            // Aktif tab'ı al
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (tab) {
                // Content script'e durdur mesajı gönder
                await chrome.tabs.sendMessage(tab.id, { 
                    action: 'stopRecording',
                    timestamp: Date.now()
                });
            }

            // UI güncellemeleri
            this.updateRecordingState(false);
            this.hideLoading();
            
        } catch (error) {
            this.showError('Kayıt durdurulamadı: ' + error.message);
            this.hideLoading();
        }
    }

    updateRecordingState(isRecording) {
        this.isRecording = isRecording;
        
        // Düğme durumları
        this.elements.startBtn.disabled = isRecording;
        this.elements.stopBtn.disabled = !isRecording;
        
        // Durum göstergeleri
        if (isRecording) {
            this.elements.statusText.textContent = 'Kayıt Ediliyor';
            this.elements.statusDot.classList.add('recording');
            this.elements.recordingIndicator.classList.remove('hidden');
        } else {
            this.elements.statusText.textContent = 'Hazır';
            this.elements.statusDot.classList.remove('recording');
            this.elements.recordingIndicator.classList.add('hidden');
        }
        
        // Hızlı aksiyon düğmelerini etkinleştir/pasifleştir
        this.elements.exportBtn.disabled = !isRecording && !this.transcriptData;
        this.elements.qaBtn.disabled = !isRecording && !this.transcriptData;
    }

    updateTranscript(data) {
        if (!data || !data.text) return;
        
        this.transcriptData += data.text + ' ';
        
        // Transkripsiyon kutusunu güncelle
        const transcriptHtml = `
            <div class="transcript-text">${this.transcriptData}</div>
        `;
        this.elements.transcriptBox.innerHTML = transcriptHtml;
        
        // Otomatik scroll
        this.elements.transcriptBox.scrollTop = this.elements.transcriptBox.scrollHeight;
        
        // Güven seviyesini güncelle
        if (data.confidence) {
            this.confidenceLevel = Math.round(data.confidence * 100);
            this.elements.confidenceIndicator.querySelector('.confidence-text').textContent = 
                `Güven: ${this.confidenceLevel}%`;
        }
    }

    updateSummary(data) {
        if (!data || !data.summary) return;
        
        this.summaryData = data.summary;
        
        // Özet kutusunu güncelle
        let summaryHtml = `<div class="summary-text">${this.summaryData}`;
        
        // Anahtar kelimeler varsa ekle
        if (data.keyPoints && data.keyPoints.length > 0) {
            summaryHtml += '<br><br><strong>Anahtar Kelimeler:</strong> ';
            summaryHtml += data.keyPoints.map(point => 
                `<span class="key-point">${point}</span>`
            ).join(', ');
        }
        
        summaryHtml += '</div>';
        this.elements.summaryBox.innerHTML = summaryHtml;
        
        // Son güncelleme zamanını göster
        const now = new Date();
        const timeStr = now.toLocaleTimeString('tr-TR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        this.elements.updateTimer.querySelector('span').textContent = 
            `Son güncelleme: ${timeStr}`;
    }

    async checkBackendConnection() {
        try {
            this.updateConnectionStatus('connecting');
            
            const response = await fetch('http://localhost:3000/api/health', {
                method: 'GET',
                timeout: 5000
            });
            
            if (response.ok) {
                this.updateConnectionStatus('online');
            } else {
                throw new Error('Backend yanıt vermiyor');
            }
            
        } catch (error) {
            console.warn('Backend bağlantısı başarısız:', error);
            this.updateConnectionStatus('offline');
        }
    }

    updateConnectionStatus(status) {
        this.connectionStatus = status;
        
        const statusTexts = {
            'online': 'Backend bağlı',
            'offline': 'Backend offline',
            'connecting': 'Bağlanıyor...'
        };
        
        this.elements.connectionText.textContent = statusTexts[status];
        this.elements.connectionDot.className = `connection-dot ${status}`;
    }

    async checkCurrentState() {
        try {
            // Aktif tab'dan mevcut durumu kontrol et
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (tab) {
                // Content script'ten durum bilgisi iste
                chrome.tabs.sendMessage(tab.id, { 
                    action: 'getStatus' 
                }, (response) => {
                    if (response && response.isRecording) {
                        this.updateRecordingState(true);
                    }
                });
            }
        } catch (error) {
            console.warn('Durum kontrolü başarısız:', error);
        }
    }

    handleMessage(message, sender, sendResponse) {
        switch (message.action) {
            case 'updateTranscript':
                this.updateTranscript(message.data);
                break;
                
            case 'updateSummary':
                this.updateSummary(message.data);
                break;
                
            case 'recordingStarted':
                this.updateRecordingState(true);
                break;
                
            case 'recordingStopped':
                this.updateRecordingState(false);
                break;
                
            case 'error':
                this.showError(message.error);
                break;
                
            case 'status':
                sendResponse({ 
                    isRecording: this.isRecording,
                    connectionStatus: this.connectionStatus
                });
                break;
        }
    }

    async exportData() {
        if (!this.transcriptData && !this.summaryData) {
            this.showError('Dışa aktarılacak veri yok');
            return;
        }

        try {
            this.showLoading('Dışa aktarılıyor...');
            
            // Veriyi hazırla
            const exportData = {
                timestamp: new Date().toISOString(),
                transcript: this.transcriptData,
                summary: this.summaryData,
                confidence: this.confidenceLevel
            };

            // JSON formatında indir
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `meetai-export-${Date.now()}.json`;
            a.click();
            
            URL.revokeObjectURL(url);
            this.hideLoading();
            
        } catch (error) {
            this.showError('Dışa aktarma başarısız: ' + error.message);
            this.hideLoading();
        }
    }

    openSettings() {
        // Ayarlar sayfasını aç (gelecek geliştirme)
        console.log('Ayarlar açılacak...');
    }

    openQABot() {
        // Soru-cevap bot'unu aç (gelecek geliştirme)
        console.log('Soru-cevap botu açılacak...');
    }

    showLoading(text = 'İşleniyor...') {
        this.elements.loadingOverlay.querySelector('.loading-text').textContent = text;
        this.elements.loadingOverlay.classList.remove('hidden');
    }

    hideLoading() {
        this.elements.loadingOverlay.classList.add('hidden');
    }

    showError(message) {
        // Geçici hata gösterimi
        const originalText = this.elements.statusText.textContent;
        this.elements.statusText.textContent = 'Hata!';
        this.elements.statusDot.style.background = '#f44336';
        
        console.error('MeetAI Hatası:', message);
        
        // 3 saniye sonra eski duruma döndür
        setTimeout(() => {
            this.elements.statusText.textContent = originalText;
            this.elements.statusDot.style.background = '';
        }, 3000);
    }
}

// Popup başlatılınca çalıştır
new MeetAIPopup(); 