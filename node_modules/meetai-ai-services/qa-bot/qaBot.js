// MeetAI QA Bot Service
const logger = require('../../backend/src/utils/logger');

class QABotService {
    constructor() {
        this.openaiClient = null;
        this.provider = 'mock';
        this.conversationContext = [];
        this.qaHistory = [];
        
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
                    logger.info('OpenAI QA Bot istemcisi başlatıldı');
                } catch (error) {
                    logger.warn('OpenAI QA Bot başlatılamadı:', error.message);
                }
            }

            logger.info(`QA Bot provider: ${this.provider}`);

        } catch (error) {
            logger.error('QA Bot servisleri başlatılamadı:', error);
            this.provider = 'mock';
        }
    }

    async askQuestion(question, context = null) {
        const startTime = Date.now();
        
        try {
            let result;

            switch (this.provider) {
                case 'openai':
                    result = await this.askWithOpenAI(question, context);
                    break;
                    
                default:
                    result = await this.askWithMock(question, context);
            }

            const processingTime = Date.now() - startTime;
            
            // Soru-cevap geçmişine ekle
            this.addToQAHistory(question, result.answer, result.confidence);

            logger.info(`QA işlemi tamamlandı (${processingTime}ms) - Provider: ${this.provider}`);

            return {
                success: true,
                question: question,
                answer: result.answer,
                confidence: result.confidence,
                sources: result.sources,
                relatedTopics: result.relatedTopics,
                provider: this.provider,
                processingTime,
                timestamp: Date.now()
            };

        } catch (error) {
            logger.error('QA işlemi hatası:', error);
            return {
                success: false,
                error: error.message,
                provider: this.provider,
                processingTime: Date.now() - startTime
            };
        }
    }

    async askWithOpenAI(question, context) {
        if (!this.openaiClient) {
            throw new Error('OpenAI istemcisi mevcut değil');
        }

        try {
            // Konuşma bağlamını hazırla
            const contextText = context || this.getRecentContext();
            
            const systemPrompt = `Sen bir toplantı asistanısın. Kullanıcıların toplantı içeriği hakkındaki sorularını yanıtlıyorsun.

Görevlerin:
1. Soruları toplantı bağlamında yanıtla
2. Kaynak bilgilerini belirt
3. Güven seviyeni belirt
4. İlgili konuları öner

Türkçe yanıt ver ve net, anlaşılır ol.`;

            const userPrompt = context 
                ? `Toplantı bağlamı: ${contextText}\n\nSoru: ${question}`
                : `Önceki konuşmalar: ${contextText}\n\nSoru: ${question}`;

            const response = await this.openaiClient.chat.completions.create({
                model: process.env.OPENAI_MODEL || 'gpt-4o',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 300,
                temperature: 0.3,
                top_p: 0.9
            });

            const aiResponse = response.choices[0].message.content;
            
            return {
                answer: aiResponse,
                confidence: 0.85, // OpenAI genelde yüksek confidence
                sources: ['Toplantı transkripsiyon', 'AI analiz'],
                relatedTopics: this.extractRelatedTopics(question, aiResponse)
            };

        } catch (error) {
            logger.error('OpenAI QA API hatası:', error);
            throw new Error(`OpenAI API hatası: ${error.message}`);
        }
    }

    async askWithMock(question, context) {
        logger.info('Mock QA servisi kullanılıyor');
        
        // Gerçekçi bir gecikme simülasyonu
        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

        const mockResponses = {
            // Genel sorular
            'default': [
                "Bu konu toplantıda detaylı olarak ele alındı. Ana noktalar şunlar: proje ilerlemesi değerlendirildi ve takım performansı tartışıldı.",
                "Toplantı kayıtlarına göre bu konuda takım üyeleri hemfikir. Özellikle teknik geliştirme aşamasında olumlu geri bildirimler var.",
                "Bu sorunun cevabını toplantı içeriğinde bulabilirsiniz. Pazarlama stratejisi güncellenmesi gerektiği belirlendi.",
                "Belirtilen konu için ek bilgi gerekebilir. Kalite kontrol süreçleri iyileştirme gerektiriyor.",
                "Toplantı sürecinde bu konu vurgulanmıştı. Ekip motivasyonunu sürdürmek için yeni yaklaşımlar önerildi."
            ],
            // Proje sorları
            'proje': [
                "Proje ilerlemesi toplantıda değerlendirildi. Teknik geliştirme aşamasında test süreçlerine odaklanılıyor.",
                "Proje takvimi gözden geçirildi. Bazı milestone'lar güncellenmesi gerekiyor ama genel ilerleme olumlu."
            ],
            // Takım soruları
            'takım': [
                "Takım performansı genel olarak tatmin edici. Motivasyon yüksek seviyelerde ve iş birliği güçlü.",
                "Takım üyeleri arasında koordinasyon iyi. Yeni projeler için rol dağılımı planlanıyor."
            ],
            // Teknoloji soruları
            'teknoloji': [
                "Teknoloji stack'i güncel tutuluyor. Yeni araçların entegrasyonu değerlendiriliyor.",
                "Teknik altyapı iyileştirmeleri planlanıyor. Performans optimizasyonları öncelikli."
            ]
        };

        // Soru tipini belirle
        const questionType = this.categorizeQuestion(question);
        const responses = mockResponses[questionType] || mockResponses['default'];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        return {
            answer: randomResponse,
            confidence: 0.75 + Math.random() * 0.20, // 0.75-0.95 arası
            sources: ['Toplantı transkripsiyon', 'Konuşma özetleri', 'Bağlam analizi'],
            relatedTopics: this.generateRelatedTopics(questionType)
        };
    }

    categorizeQuestion(question) {
        const questionLower = question.toLowerCase();
        
        if (questionLower.includes('proje') || questionLower.includes('geliştirme') || questionLower.includes('takvim')) {
            return 'proje';
        } else if (questionLower.includes('takım') || questionLower.includes('ekip') || questionLower.includes('kişi')) {
            return 'takım';
        } else if (questionLower.includes('teknoloji') || questionLower.includes('sistem') || questionLower.includes('altyapı')) {
            return 'teknoloji';
        } else {
            return 'default';
        }
    }

    generateRelatedTopics(category) {
        const relatedTopics = {
            'proje': ['Proje ilerlemesi', 'Teknik geliştirme', 'Test süreçleri', 'Milestone\'lar'],
            'takım': ['Ekip performansı', 'Motivasyon', 'İş birliği', 'Rol dağılımı'],
            'teknoloji': ['Teknoloji stack', 'Altyapı', 'Performans', 'Entegrasyon'],
            'default': ['Toplantı özeti', 'Ana konular', 'Aksiyon maddeleri', 'Sonraki adımlar']
        };
        
        return relatedTopics[category] || relatedTopics['default'];
    }

    extractRelatedTopics(question, answer) {
        // Basit anahtar kelime çıkarma
        const text = `${question} ${answer}`.toLowerCase();
        const keywords = text.split(/\s+/)
            .filter(word => word.length > 4)
            .filter(word => !['bunlar', 'şunlar', 'bundan', 'şundan'].includes(word))
            .slice(0, 4);
        
        return keywords.length > 0 ? keywords : ['Genel konular'];
    }

    setConversationContext(context) {
        this.conversationContext = Array.isArray(context) ? context : [context];
    }

    getRecentContext(limit = 5) {
        return this.conversationContext.slice(-limit).join(' ');
    }

    addToQAHistory(question, answer, confidence) {
        this.qaHistory.push({
            timestamp: Date.now(),
            question: question,
            answer: answer,
            confidence: confidence
        });

        // Son 20 soru-cevabı tut
        if (this.qaHistory.length > 20) {
            this.qaHistory = this.qaHistory.slice(-20);
        }
    }

    // İstatistikleri al
    getStats() {
        return {
            provider: this.provider,
            totalQuestions: this.qaHistory.length,
            averageConfidence: this.qaHistory.length > 0 
                ? this.qaHistory.reduce((sum, qa) => sum + qa.confidence, 0) / this.qaHistory.length 
                : 0,
            contextItems: this.conversationContext.length,
            lastQuestion: this.qaHistory[this.qaHistory.length - 1]?.timestamp || null
        };
    }

    // Geçmişi temizle
    clearHistory() {
        this.qaHistory = [];
        this.conversationContext = [];
        logger.info('QA Bot geçmişi temizlendi');
    }

    // Export için veri hazırla
    exportData() {
        return {
            qaHistory: this.qaHistory,
            conversationContext: this.conversationContext,
            stats: this.getStats(),
            exportedAt: Date.now()
        };
    }
}

module.exports = new QABotService(); 