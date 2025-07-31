// MeetAI Content Script - Ses Yakalama ve İşleme
class MeetAIContentScript {
    constructor() {
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.audioStream = null;
        this.processInterval = null;
        this.chunkCounter = 0;
        this.lastTranscript = '';
        this.conversationHistory = [];
        
        // Backend URL
        this.backendURL = 'http://localhost:3000';
        
        // Platform tespiti
        this.platform = this.detectPlatform();
        
        // Message listener'ı başlat
        this.init();
    }

    init() {
        // Chrome extension mesajlarını dinle
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            this.handleMessage(message, sender, sendResponse);
            return true; // Async response için
        });

        console.log(`MeetAI Content Script başlatıldı - Platform: ${this.platform}`);
        
        // Sayfa yüklendiğinde platform özel hazırlıkları yap
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupPlatformSpecific());
        } else {
            this.setupPlatformSpecific();
        }
    }

    detectPlatform() {
        const hostname = window.location.hostname;
        
        if (hostname.includes('meet.google.com')) {
            return 'google-meet';
        } else if (hostname.includes('zoom.us')) {
            return 'zoom';
        } else if (hostname.includes('teams.microsoft.com')) {
            return 'teams';
        } else {
            return 'unknown';
        }
    }

    setupPlatformSpecific() {
        // Platform özel optimizasyonlar
        switch (this.platform) {
            case 'google-meet':
                this.setupGoogleMeet();
                break;
            case 'zoom':
                this.setupZoom();
                break;
            case 'teams':
                this.setupTeams();
                break;
            default:
                console.warn('Desteklenmeyen platform');
        }
    }

    setupGoogleMeet() {
        // Google Meet özel ayarları
        console.log('Google Meet optimizasyonları aktif');
        
        // Meet'in ses ayarlarını algıla
        this.waitForMeetElements();
    }

    setupZoom() {
        // Zoom özel ayarları
        console.log('Zoom optimizasyonları aktif');
    }

    setupTeams() {
        // Teams özel ayarları
        console.log('Teams optimizasyonları aktif');
    }

    waitForMeetElements() {
        // Google Meet'in UI elementlerini bekle
        const checkElements = () => {
            const micButton = document.querySelector('[data-is-muted]');
            const participantsArea = document.querySelector('[data-participants-count]');
            
            if (micButton || participantsArea) {
                console.log('Google Meet elementleri hazır');
                return true;
            }
            return false;
        };

        if (!checkElements()) {
            setTimeout(() => this.waitForMeetElements(), 1000);
        }
    }

    handleMessage(message, sender, sendResponse) {
        switch (message.action) {
            case 'startRecording':
                this.startRecording()
                    .then(() => sendResponse({ success: true }))
                    .catch(error => sendResponse({ success: false, error: error.message }));
                break;

            case 'stopRecording':
                this.stopRecording()
                    .then(() => sendResponse({ success: true }))
                    .catch(error => sendResponse({ success: false, error: error.message }));
                break;

            case 'getStatus':
                sendResponse({
                    isRecording: this.isRecording,
                    platform: this.platform,
                    chunksProcessed: this.chunkCounter
                });
                break;

            default:
                sendResponse({ success: false, error: 'Bilinmeyen aksiyon' });
        }
    }

    async startRecording() {
        if (this.isRecording) {
            throw new Error('Kayıt zaten devam ediyor');
        }

        try {
            console.log('Ses yakalama başlatılıyor...');

            // Mikrofon erişimi iste
            this.audioStream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 16000,
                    channelCount: 1
                }
            });

            // MediaRecorder'ı yapılandır
            const options = {
                mimeType: 'audio/webm;codecs=opus'
            };

            // Tarayıcı desteğini kontrol et
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                options.mimeType = 'audio/webm';
            }

            this.mediaRecorder = new MediaRecorder(this.audioStream, options);

            // Event handler'ları ekle
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                    console.log(`Ses parçası alındı: ${event.data.size} bytes`);
                }
            };

            this.mediaRecorder.onstart = () => {
                console.log('MediaRecorder başladı');
                this.isRecording = true;
                
                // Popup'a bildir
                chrome.runtime.sendMessage({
                    action: 'recordingStarted',
                    platform: this.platform
                });
            };

            this.mediaRecorder.onstop = () => {
                console.log('MediaRecorder durdu');
                this.isRecording = false;
                
                // Son ses parçasını işle
                if (this.audioChunks.length > 0) {
                    this.processAudioChunk();
                }
                
                // Popup'a bildir
                chrome.runtime.sendMessage({
                    action: 'recordingStopped'
                });
            };

            this.mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder hatası:', event.error);
                this.handleRecordingError(event.error);
            };

            // Kayıt başlat (her 5 saniyede bir chunk)
            this.mediaRecorder.start(5000);

            // Periyodik işleme başlat
            this.startPeriodicProcessing();

            console.log('Ses yakalama başarıyla başlatıldı');

        } catch (error) {
            console.error('Ses yakalama başlatılamadı:', error);
            this.cleanup();
            throw error;
        }
    }

    async stopRecording() {
        if (!this.isRecording) {
            throw new Error('Kayıt zaten durmuş');
        }

        try {
            console.log('Ses yakalama durduruluyor...');

            // Periyodik işlemeyi durdur
            this.stopPeriodicProcessing();

            // MediaRecorder'ı durdur
            if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
                this.mediaRecorder.stop();
            }

            // Cleanup
            await this.cleanup();

            console.log('Ses yakalama başarıyla durduruldu');

        } catch (error) {
            console.error('Ses yakalama durdurulamadı:', error);
            throw error;
        }
    }

    startPeriodicProcessing() {
        // Her 5 saniyede bir ses verilerini işle
        this.processInterval = setInterval(() => {
            if (this.audioChunks.length > 0) {
                this.processAudioChunk();
            }
        }, 5000);
    }

    stopPeriodicProcessing() {
        if (this.processInterval) {
            clearInterval(this.processInterval);
            this.processInterval = null;
        }
    }

    async processAudioChunk() {
        if (this.audioChunks.length === 0) return;

        try {
            // Ses verilerini birleştir
            const audioBlob = new Blob(this.audioChunks, { 
                type: 'audio/webm' 
            });

            // Chunk'ları temizle
            this.audioChunks = [];
            this.chunkCounter++;

            console.log(`Ses parçası işleniyor... (${this.chunkCounter})`);

            // Backend'e gönder
            await this.sendAudioToBackend(audioBlob);

        } catch (error) {
            console.error('Ses parçası işlenirken hata:', error);
            
            // Popup'a hata bildir
            chrome.runtime.sendMessage({
                action: 'error',
                error: error.message
            });
        }
    }

    async sendAudioToBackend(audioBlob) {
        try {
            // FormData oluştur
            const formData = new FormData();
            formData.append('audio', audioBlob, `chunk-${this.chunkCounter}.webm`);
            formData.append('platform', this.platform);
            formData.append('timestamp', Date.now().toString());
            formData.append('chunkNumber', this.chunkCounter.toString());

            // Backend'e gönder
            const response = await fetch(`${this.backendURL}/api/transcription/process`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Backend hatası: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();

            if (result.success) {
                // Transkripsiyon sonucunu işle
                this.handleTranscriptionResult(result);
            } else {
                throw new Error(result.error || 'Bilinmeyen backend hatası');
            }

        } catch (error) {
            console.error('Backend iletişim hatası:', error);
            
            // Bağlantı hatası için tekrar dene (basit retry logic)
            if (error.message.includes('Failed to fetch')) {
                console.log('Backend\'e ulaşılamıyor, tekrar denenecek...');
                setTimeout(() => {
                    this.sendAudioToBackend(audioBlob);
                }, 3000);
            }
            
            throw error;
        }
    }

    handleTranscriptionResult(result) {
        console.log('Transkripsiyon sonucu alındı:', result);

        // Konuşma geçmişine ekle
        if (result.transcript && result.transcript.trim()) {
            this.conversationHistory.push({
                timestamp: Date.now(),
                text: result.transcript,
                confidence: result.confidence || 0
            });

            // Popup'a transkripsiyon gönder
            chrome.runtime.sendMessage({
                action: 'updateTranscript',
                data: {
                    text: result.transcript,
                    confidence: result.confidence,
                    timestamp: Date.now()
                }
            });
        }

        // Özet varsa popup'a gönder
        if (result.summary) {
            chrome.runtime.sendMessage({
                action: 'updateSummary',
                data: {
                    summary: result.summary,
                    keyPoints: result.keyPoints || [],
                    timestamp: Date.now()
                }
            });
        }
    }

    handleRecordingError(error) {
        console.error('Kayıt hatası:', error);
        
        this.cleanup();
        
        // Popup'a hata bildir
        chrome.runtime.sendMessage({
            action: 'error',
            error: error.message || 'Kayıt hatası oluştu'
        });
    }

    async cleanup() {
        // Stream'i durdur
        if (this.audioStream) {
            this.audioStream.getTracks().forEach(track => {
                track.stop();
                console.log('Audio track durduruldu');
            });
            this.audioStream = null;
        }

        // MediaRecorder'ı temizle
        this.mediaRecorder = null;

        // Verileri temizle
        this.audioChunks = [];
        
        // Periyodik işlemeyi durdur
        this.stopPeriodicProcessing();

        // Durum sıfırla
        this.isRecording = false;
        
        console.log('Cleanup tamamlandı');
    }

    // Conversation history'yi dışa aktar
    getConversationHistory() {
        return {
            platform: this.platform,
            totalChunks: this.chunkCounter,
            history: this.conversationHistory,
            startTime: this.conversationHistory[0]?.timestamp || null,
            endTime: this.conversationHistory[this.conversationHistory.length - 1]?.timestamp || null
        };
    }

    // Debug bilgileri
    getDebugInfo() {
        return {
            isRecording: this.isRecording,
            platform: this.platform,
            chunksProcessed: this.chunkCounter,
            audioChunksWaiting: this.audioChunks.length,
            conversationLength: this.conversationHistory.length,
            mediaRecorderState: this.mediaRecorder?.state || 'null',
            streamActive: this.audioStream?.active || false
        };
    }
}

// Content script başlat
const meetAI = new MeetAIContentScript();

// Global erişim için window'a ekle (debug amaçlı)
window.meetAI = meetAI;

console.log('MeetAI Content Script yüklendi'); 