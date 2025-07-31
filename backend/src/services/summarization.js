// MeetAI Summarization Service
const logger = require('../utils/logger');

class SummarizationService {
    constructor() {
        this.openaiClient = null;
        this.geminiClient = null;
        this.provider = 'mock';
        this.conversationHistory = [];
        this.summaryHistory = [];
        
        this.initializeProviders();
    }

    async initializeProviders() {
        try {
            // OpenAI initialize
            if (process.env.OPENAI_API_KEY) {
                try {
                    const OpenAI = require('openai');
                    this.openaiClient = new OpenAI({
                        apiKey: process.env.OPENAI_API_KEY
                    });
                    this.provider = 'openai';
                    logger.info('OpenAI istemcisi başlatıldı (summarization)');
                } catch (error) {
                    logger.warn('OpenAI başlatılamadı:', error.message);
                }
            }

            // Gemini initialize (gelecek özellik)
            if (process.env.GEMINI_API_KEY) {
                try {
                    // Gemini API entegrasyonu buraya eklenecek
                    logger.info('Gemini entegrasyonu hazırlanıyor...');
                } catch (error) {
                    logger.warn('Gemini başlatılamadı:', error.message);
                }
            }

            logger.info(`Summarization provider: ${this.provider}`);

        } catch (error) {
            logger.error('Summarization servisleri başlatılamadı:', error);
            this.provider = 'mock';
        }
    }

    async generateSummary(transcript, options = {}) {
        const startTime = Date.now();
        
        try {
            // Transkripti konuşma geçmişine ekle
            this.addToConversationHistory(transcript);

            let result;

            switch (this.provider) {
                case 'openai':
                    result = await this.summarizeWithOpenAI(transcript, options);
                    break;
                    
                case 'gemini':
                    result = await this.summarizeWithGemini(transcript, options);
                    break;
                    
                default:
                    result = await this.summarizeWithMock(transcript, options);
            }

            const processingTime = Date.now() - startTime;
            
            // Özet geçmişine ekle
            this.addToSummaryHistory(result);

            logger.info(`Özetleme tamamlandı (${processingTime}ms) - Provider: ${this.provider}`);

            return {
                success: true,
                summary: result.summary,
                keyPoints: result.keyPoints,
                sentiment: result.sentiment,
                actionItems: result.actionItems,
                participants: result.participants,
                topics: result.topics,
                provider: this.provider,
                processingTime,
                timestamp: Date.now()
            };

        } catch (error) {
            logger.error('Özetleme hatası:', error);
            return {
                success: false,
                error: error.message,
                provider: this.provider,
                processingTime: Date.now() - startTime
            };
        }
    }

    async summarizeWithOpenAI(transcript, options) {
        if (!this.openaiClient) {
            throw new Error('OpenAI istemcisi mevcut değil');
        }

        try {
            // Konuşma geçmişini birleştir
            const fullContext = this.getRecentContext(options.contextLength || 5);
            const contextText = fullContext.join('\n\n');

            const systemPrompt = `Sen bir toplantı asistanısın. Toplantı konuşmalarını analiz edip özetliyorsun.

Görevlerin:
1. Ana konuları ve önemli noktaları özetle
2. Anahtar kelimeleri çıkar
3. Duygusal tonu analiz et (pozitif/nötr/negatif)
4. Eylem maddelerini tespit et
5. Katılımcıları ve ana konuları belirle

Türkçe yanıt ver ve yapılandırılmış bir format kullan.`;

            const userPrompt = `Aşağıdaki toplantı metnini analiz et:

${contextText}

Son eklenen metin:
${transcript}

Lütfen şu formatta yanıt ver:
ÖZET: [Ana konuların kısa özeti]
ANAHTAR KELİMELER: [virgülle ayrılmış anahtar kelimeler]
EYLEM MADDELERİ: [yapılması gerekenler]
DUYGUSAL TON: [pozitif/nötr/negatif]
KONULAR: [tartışılan ana konular]`;

            const response = await this.openaiClient.chat.completions.create({
                model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 500,
                temperature: 0.3,
                top_p: 0.9
            });

            const aiResponse = response.choices[0].message.content;
            
            // Yanıtı parse et
            return this.parseStructuredResponse(aiResponse);

        } catch (error) {
            logger.error('OpenAI API hatası:', error);
            throw new Error(`OpenAI API hatası: ${error.message}`);
        }
    }

    async summarizeWithGemini(transcript, options) {
        // Gelecek özellik - Gemini API entegrasyonu
        throw new Error('Gemini entegrasyonu henüz hazır değil');
    }

    async summarizeWithMock(transcript, options) {
        logger.info('Mock özetleme servisi kullanılıyor');
        
        // Gerçekçi bir gecikme simülasyonu
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

        const mockSummaries = [
            {
                summary: "Toplantıda proje ilerlemesi değerlendirildi. Teknik ekibin geliştirdiği özellikler test aşamasında. Pazarlama stratejisi güncellenmesi gerektiği belirlendi.",
                keyPoints: ["proje ilerlemesi", "teknik geliştirme", "test süreci", "pazarlama stratejisi"],
                sentiment: "pozitif",
                actionItems: ["Test sonuçlarını değerlendirmek", "Pazarlama planını güncellemek", "Sonraki toplantıyı planlamak"],
                topics: ["Proje Yönetimi", "Teknik Geliştirme", "Pazarlama"],
                participants: ["Proje Yöneticisi", "Teknik Ekip", "Pazarlama Ekibi"]
            },
            {
                summary: "Ekip performansı ve motivasyon durumu tartışıldı. İş birliği platformundaki güncellemeler olumlu sonuçlar veriyor. Kalite kontrol süreçleri iyileştirilebilir.",
                keyPoints: ["ekip performansı", "motivasyon", "iş birliği", "kalite kontrol"],
                sentiment: "pozitif",
                actionItems: ["Kalite kontrol süreçlerini gözden geçirmek", "Ekip motivasyonunu sürdürmek"],
                topics: ["İnsan Kaynakları", "Kalite Yönetimi", "İş Birliği"],
                participants: ["İK Müdürü", "Kalite Kontrol", "Ekip Liderleri"]
            }
        ];

        const randomSummary = mockSummaries[Math.floor(Math.random() * mockSummaries.length)];
        
        return {
            ...randomSummary,
            summary: `${randomSummary.summary} (Mock özet - ${Date.now()})`
        };
    }

    parseStructuredResponse(aiResponse) {
        const defaultResult = {
            summary: aiResponse,
            keyPoints: [],
            sentiment: 'nötr',
            actionItems: [],
            topics: [],
            participants: []
        };

        try {
            const lines = aiResponse.split('\n');
            const result = { ...defaultResult };

            lines.forEach(line => {
                const lowerLine = line.toLowerCase();
                
                if (lowerLine.startsWith('özet:')) {
                    result.summary = line.substring(5).trim();
                } else if (lowerLine.startsWith('anahtar kelimeler:')) {
                    result.keyPoints = line.substring(18).split(',').map(k => k.trim()).filter(k => k);
                } else if (lowerLine.startsWith('eylem maddeleri:')) {
                    result.actionItems = [line.substring(16).trim()].filter(a => a);
                } else if (lowerLine.startsWith('duygusal ton:')) {
                    result.sentiment = line.substring(13).trim();
                } else if (lowerLine.startsWith('konular:')) {
                    result.topics = line.substring(8).split(',').map(t => t.trim()).filter(t => t);
                }
            });

            return result;

        } catch (error) {
            logger.warn('Structured response parse edilemedi:', error);
            return defaultResult;
        }
    }

    addToConversationHistory(transcript) {
        if (!transcript || transcript.trim().length === 0) return;

        this.conversationHistory.push({
            timestamp: Date.now(),
            text: transcript.trim()
        });

        // Son 20 item'ı tut (memory yönetimi)
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
        }
    }

    addToSummaryHistory(summary) {
        this.summaryHistory.push({
            timestamp: Date.now(),
            ...summary
        });

        // Son 10 özeti tut
        if (this.summaryHistory.length > 10) {
            this.summaryHistory = this.summaryHistory.slice(-10);
        }
    }

    getRecentContext(length = 5) {
        return this.conversationHistory
            .slice(-length)
            .map(item => item.text);
    }

    // Tam konuşma özetini oluştur
    async generateFullSummary(options = {}) {
        if (this.conversationHistory.length === 0) {
            return {
                success: false,
                error: 'Özetlenecek konuşma bulunamadı'
            };
        }

        const fullTranscript = this.conversationHistory
            .map(item => item.text)
            .join(' ');

        return await this.generateSummary(fullTranscript, {
            ...options,
            fullSummary: true
        });
    }

    // İstatistikleri al
    getStats() {
        return {
            conversationItems: this.conversationHistory.length,
            summaryCount: this.summaryHistory.length,
            totalWords: this.conversationHistory.reduce((total, item) => 
                total + item.text.split(' ').length, 0),
            firstMessage: this.conversationHistory[0]?.timestamp || null,
            lastMessage: this.conversationHistory[this.conversationHistory.length - 1]?.timestamp || null
        };
    }

    // Geçmişi temizle
    clearHistory() {
        this.conversationHistory = [];
        this.summaryHistory = [];
        logger.info('Konuşma ve özet geçmişi temizlendi');
    }

    // Export için veri hazırla
    exportData() {
        return {
            conversationHistory: this.conversationHistory,
            summaryHistory: this.summaryHistory,
            stats: this.getStats(),
            exportedAt: Date.now()
        };
    }
}

module.exports = new SummarizationService(); 