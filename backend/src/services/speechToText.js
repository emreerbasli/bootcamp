// MeetAI Speech-to-Text Service
const logger = require('../utils/logger');

class SpeechToTextService {
    constructor() {
        this.googleClient = null;
        this.openaiClient = null;
        this.provider = 'mock'; // 'google', 'openai', 'mock'
        
        this.initializeProviders();
    }

    async initializeProviders() {
        try {
            // Google Speech-to-Text initialize
            if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
                try {
                    const speech = require('@google-cloud/speech');
                    this.googleClient = new speech.SpeechClient();
                    this.provider = 'google';
                    logger.info('Google Speech-to-Text istemcisi başlatıldı');
                } catch (error) {
                    logger.warn('Google Speech-to-Text başlatılamadı:', error.message);
                }
            }

            // OpenAI Whisper initialize
            if (process.env.OPENAI_API_KEY) {
                try {
                    const OpenAI = require('openai');
                    this.openaiClient = new OpenAI({
                        apiKey: process.env.OPENAI_API_KEY
                    });
                    
                    // Google yoksa OpenAI'ı kullan
                    if (!this.googleClient) {
                        this.provider = 'openai';
                    }
                    logger.info('OpenAI Whisper istemcisi başlatıldı');
                } catch (error) {
                    logger.warn('OpenAI Whisper başlatılamadı:', error.message);
                }
            }

            logger.info(`Speech-to-Text provider: ${this.provider}`);

        } catch (error) {
            logger.error('Speech-to-Text servisleri başlatılamadı:', error);
            this.provider = 'mock';
        }
    }

    async transcribeAudio(audioBuffer, options = {}) {
        const startTime = Date.now();
        
        try {
            let result;

            switch (this.provider) {
                case 'google':
                    result = await this.transcribeWithGoogle(audioBuffer, options);
                    break;
                    
                case 'openai':
                    result = await this.transcribeWithOpenAI(audioBuffer, options);
                    break;
                    
                default:
                    result = await this.transcribeWithMock(audioBuffer, options);
            }

            const processingTime = Date.now() - startTime;
            logger.info(`Transkripsiyon tamamlandı (${processingTime}ms) - Provider: ${this.provider}`);

            return {
                success: true,
                transcript: result.transcript,
                confidence: result.confidence,
                provider: this.provider,
                processingTime,
                language: result.language || 'tr-TR',
                alternatives: result.alternatives || []
            };

        } catch (error) {
            logger.error('Transkripsiyon hatası:', error);
            return {
                success: false,
                error: error.message,
                provider: this.provider,
                processingTime: Date.now() - startTime
            };
        }
    }

    async transcribeWithGoogle(audioBuffer, options) {
        if (!this.googleClient) {
            throw new Error('Google Speech-to-Text istemcisi mevcut değil');
        }

        const request = {
            audio: {
                content: audioBuffer.toString('base64')
            },
            config: {
                encoding: options.encoding || 'WEBM_OPUS',
                sampleRateHertz: options.sampleRate || 16000,
                languageCode: options.language || 'tr-TR',
                enableAutomaticPunctuation: true,
                enableWordTimeOffsets: true,
                model: 'latest_long',
                useEnhanced: true,
                alternativeLanguageCodes: ['en-US'],
                maxAlternatives: 3,
                profanityFilter: false,
                enableWordConfidence: true
            }
        };

        try {
            const [response] = await this.googleClient.recognize(request);
            
            if (!response.results || response.results.length === 0) {
                return {
                    transcript: '',
                    confidence: 0,
                    alternatives: []
                };
            }

            const result = response.results[0];
            const alternative = result.alternatives[0];
            
            return {
                transcript: alternative.transcript || '',
                confidence: alternative.confidence || 0,
                language: request.config.languageCode,
                alternatives: result.alternatives.slice(1).map(alt => ({
                    transcript: alt.transcript,
                    confidence: alt.confidence
                })),
                words: alternative.words || []
            };

        } catch (error) {
            logger.error('Google Speech-to-Text API hatası:', error);
            throw new Error(`Google API hatası: ${error.message}`);
        }
    }

    async transcribeWithOpenAI(audioBuffer, options) {
        if (!this.openaiClient) {
            throw new Error('OpenAI istemcisi mevcut değil');
        }

        try {
            // Buffer'ı File objesine dönüştür
            const audioFile = new File([audioBuffer], 'audio.webm', {
                type: 'audio/webm'
            });

            const response = await this.openaiClient.audio.transcriptions.create({
                file: audioFile,
                model: 'whisper-1',
                language: options.language || 'tr',
                response_format: 'verbose_json',
                temperature: 0.2
            });

            return {
                transcript: response.text || '',
                confidence: 0.85, // Whisper genelde yüksek confidence verir
                language: response.language || 'tr',
                alternatives: [],
                duration: response.duration
            };

        } catch (error) {
            logger.error('OpenAI Whisper API hatası:', error);
            throw new Error(`OpenAI API hatası: ${error.message}`);
        }
    }

    async transcribeWithMock(audioBuffer, options) {
        // Demo amaçlı mock transkripsiyon
        logger.info('Mock transkripsiyon servisi kullanılıyor');
        
        // Gerçekçi bir gecikme simülasyonu
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

        const mockTranscripts = [
            "Merhaba, bugünün toplantısına hoş geldiniz. Gündemimizde proje durumu var.",
            "Geçen hafta belirlediğimiz hedefleri değerlendiriyoruz. İlerleme kaydettiğimiz alanlar var.",
            "Teknik ekibimizin geliştirdiği yeni özellikler test aşamasında. Kullanıcı geri bildirimlerini bekliyoruz.",
            "Pazarlama stratejimizi güncellememiz gerekiyor. Yeni hedef kitleyi dikkate almalıyız.",
            "Bütçe planlaması için mali işler departmanıyla koordinasyon halindeyiz.",
            "Proje takvimimizi gözden geçiriyoruz. Bazı milestone'lar güncellenebilir.",
            "Kalite kontrol süreçlerimizi iyileştirmek için yeni yöntemler araştırıyoruz.",
            "Ekip performansı genel olarak tatmin edici. Motivasyon yüksek seviyelerde.",
            "İş birliği platformumuz üzerinde yapılan güncellemeler olumlu sonuçlar veriyor.",
            "Sonraki toplantımızı gelecek hafta aynı saatte planlıyoruz."
        ];

        const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
        
        return {
            transcript: randomTranscript,
            confidence: 0.80 + Math.random() * 0.15, // 0.80-0.95 arası
            language: 'tr-TR',
            alternatives: [
                {
                    transcript: randomTranscript.replace(/\./g, ','),
                    confidence: 0.70 + Math.random() * 0.10
                }
            ]
        };
    }

    // Desteklenen dilleri al
    getSupportedLanguages() {
        return [
            { code: 'tr-TR', name: 'Türkçe' },
            { code: 'en-US', name: 'English (US)' },
            { code: 'en-GB', name: 'English (UK)' },
            { code: 'de-DE', name: 'Deutsch' },
            { code: 'fr-FR', name: 'Français' },
            { code: 'es-ES', name: 'Español' },
            { code: 'it-IT', name: 'Italiano' },
            { code: 'pt-BR', name: 'Português (Brasil)' },
            { code: 'ru-RU', name: 'Русский' },
            { code: 'ja-JP', name: '日本語' },
            { code: 'ko-KR', name: '한국어' },
            { code: 'zh-CN', name: '中文 (简体)' }
        ];
    }

    // Provider durumunu kontrol et
    getProviderStatus() {
        return {
            current: this.provider,
            available: {
                google: !!this.googleClient,
                openai: !!this.openaiClient,
                mock: true
            }
        };
    }

    // Provider'ı değiştir
    setProvider(provider) {
        const availableProviders = ['google', 'openai', 'mock'];
        
        if (!availableProviders.includes(provider)) {
            throw new Error('Geçersiz provider');
        }

        if (provider === 'google' && !this.googleClient) {
            throw new Error('Google Speech-to-Text mevcut değil');
        }

        if (provider === 'openai' && !this.openaiClient) {
            throw new Error('OpenAI Whisper mevcut değil');
        }

        this.provider = provider;
        logger.info(`Speech-to-Text provider değiştirildi: ${provider}`);
    }
}

module.exports = new SpeechToTextService(); 