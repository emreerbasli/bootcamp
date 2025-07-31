// MeetAI Transcription Controller
const speechToTextService = require('../services/speechToText');
const summarizationService = require('../services/summarization');
const qaBot = require('../../../ai-services/qa-bot/qaBot');
const logger = require('../utils/logger');

class TranscriptionController {
    
    // Ana ses işleme endpoint'i
    async processAudio(req, res) {
        const startTime = Date.now();
        
        try {
            // Request validation
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    error: 'Ses dosyası bulunamadı',
                    code: 'MISSING_AUDIO_FILE'
                });
            }

            const audioBuffer = req.file.buffer;
            const platform = req.body.platform || 'unknown';
            const timestamp = req.body.timestamp || Date.now();
            const chunkNumber = req.body.chunkNumber || 1;

            logger.info(`Ses işleme başlatıldı - Platform: ${platform}, Chunk: ${chunkNumber}, Boyut: ${audioBuffer.length} bytes`);

            // Ses dosyasını transkripte çevir
            const transcriptionOptions = {
                encoding: 'WEBM_OPUS',
                sampleRate: 16000,
                language: 'tr-TR'
            };

            const transcriptionResult = await speechToTextService.transcribeAudio(audioBuffer, transcriptionOptions);

            if (!transcriptionResult.success) {
                return res.status(500).json({
                    success: false,
                    error: 'Transkripsiyon başarısız',
                    details: transcriptionResult.error,
                    code: 'TRANSCRIPTION_FAILED'
                });
            }

            let summaryResult = null;

            // Eğer transkripsiyon varsa özet oluştur
            if (transcriptionResult.transcript && transcriptionResult.transcript.trim().length > 0) {
                try {
                    summaryResult = await summarizationService.generateSummary(
                        transcriptionResult.transcript,
                        {
                            platform: platform,
                            chunkNumber: chunkNumber
                        }
                    );
                } catch (summaryError) {
                    logger.warn('Özetleme başarısız:', summaryError.message);
                    // Özetleme hatası fatal değil, devam et
                }
            }

            const totalProcessingTime = Date.now() - startTime;

            // Başarılı yanıt
            const response = {
                success: true,
                transcript: transcriptionResult.transcript,
                confidence: transcriptionResult.confidence,
                language: transcriptionResult.language,
                summary: summaryResult?.summary || null,
                keyPoints: summaryResult?.keyPoints || [],
                sentiment: summaryResult?.sentiment || null,
                actionItems: summaryResult?.actionItems || [],
                topics: summaryResult?.topics || [],
                metadata: {
                    platform: platform,
                    chunkNumber: parseInt(chunkNumber),
                    timestamp: parseInt(timestamp),
                    processingTime: totalProcessingTime,
                    transcriptionProvider: transcriptionResult.provider,
                    summaryProvider: summaryResult?.provider || null,
                    audioSize: audioBuffer.length
                }
            };

            logger.info(`Ses işleme tamamlandı - Chunk: ${chunkNumber}, Süre: ${totalProcessingTime}ms`);

            res.json(response);

        } catch (error) {
            const processingTime = Date.now() - startTime;
            
            logger.error('Ses işleme hatası:', error);
            
            res.status(500).json({
                success: false,
                error: 'Ses işleme sırasında hata oluştu',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined,
                code: 'PROCESSING_ERROR',
                metadata: {
                    processingTime: processingTime,
                    timestamp: Date.now()
                }
            });
        }
    }

    // Manuel özet oluşturma
    async generateSummary(req, res) {
        try {
            const { text, options = {} } = req.body;

            if (!text || text.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Özetlenecek metin bulunamadı',
                    code: 'MISSING_TEXT'
                });
            }

            logger.info('Manuel özet oluşturma başlatıldı');

            const summaryResult = await summarizationService.generateSummary(text, options);

            if (!summaryResult.success) {
                return res.status(500).json({
                    success: false,
                    error: 'Özetleme başarısız',
                    details: summaryResult.error,
                    code: 'SUMMARIZATION_FAILED'
                });
            }

            res.json(summaryResult);

        } catch (error) {
            logger.error('Özet oluşturma hatası:', error);
            
            res.status(500).json({
                success: false,
                error: 'Özetleme sırasında hata oluştu',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined,
                code: 'SUMMARIZATION_ERROR'
            });
        }
    }

    // Soru-cevap botu
    async askQuestion(req, res) {
        try {
            const { question, context } = req.body;

            if (!question || question.trim().length === 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Soru bulunamadı',
                    code: 'MISSING_QUESTION'
                });
            }

            logger.info(`Soru-cevap işlemi başlatıldı: "${question}"`);

            // QA Bot'a konuşma bağlamını set et
            if (context) {
                qaBot.setConversationContext(context);
            }

            // Soruyu QA Bot'a gönder
            const qaResult = await qaBot.askQuestion(question, context);

            if (!qaResult.success) {
                return res.status(500).json({
                    success: false,
                    error: 'QA Bot işlemi başarısız',
                    details: qaResult.error,
                    code: 'QA_BOT_ERROR'
                });
            }

            res.json(qaResult);

        } catch (error) {
            logger.error('Soru-cevap hatası:', error);
            
            res.status(500).json({
                success: false,
                error: 'Soru-cevap sırasında hata oluştu',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined,
                code: 'QA_ERROR'
            });
        }
    }

    // Servis durumlarını kontrol et
    async getServiceStatus(req, res) {
        try {
            const speechStatus = speechToTextService.getProviderStatus();
            const summaryStats = summarizationService.getStats();

            res.json({
                success: true,
                services: {
                    speechToText: {
                        currentProvider: speechStatus.current,
                        availableProviders: speechStatus.available,
                        status: speechStatus.current !== 'mock' ? 'online' : 'mock'
                    },
                    summarization: {
                        conversationItems: summaryStats.conversationItems,
                        summaryCount: summaryStats.summaryCount,
                        totalWords: summaryStats.totalWords,
                        status: 'online'
                    }
                },
                timestamp: Date.now()
            });

        } catch (error) {
            logger.error('Servis durumu kontrolü hatası:', error);
            
            res.status(500).json({
                success: false,
                error: 'Servis durumu alınamadı',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Tam konuşma özetini al
    async getFullSummary(req, res) {
        try {
            logger.info('Tam konuşma özeti talep edildi');

            const fullSummaryResult = await summarizationService.generateFullSummary({
                detailed: true
            });

            if (!fullSummaryResult.success) {
                return res.status(400).json(fullSummaryResult);
            }

            res.json(fullSummaryResult);

        } catch (error) {
            logger.error('Tam özet oluşturma hatası:', error);
            
            res.status(500).json({
                success: false,
                error: 'Tam özet oluşturulamadı',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Export verilerini hazırla
    async exportData(req, res) {
        try {
            const { format = 'json' } = req.query;

            logger.info(`Veri export'u başlatıldı - Format: ${format}`);

            const exportData = {
                ...summarizationService.exportData(),
                speechToTextStatus: speechToTextService.getProviderStatus(),
                exportFormat: format,
                generatedAt: new Date().toISOString()
            };

            switch (format.toLowerCase()) {
                case 'json':
                    res.setHeader('Content-Type', 'application/json');
                    res.setHeader('Content-Disposition', 'attachment; filename="meetai-export.json"');
                    res.json(exportData);
                    break;

                case 'txt':
                    const textContent = exportData.conversationHistory
                        .map(item => `[${new Date(item.timestamp).toLocaleString()}] ${item.text}`)
                        .join('\n\n');
                    
                    res.setHeader('Content-Type', 'text/plain');
                    res.setHeader('Content-Disposition', 'attachment; filename="meetai-transcript.txt"');
                    res.send(textContent);
                    break;

                default:
                    throw new Error('Desteklenmeyen format');
            }

        } catch (error) {
            logger.error('Export hatası:', error);
            
            res.status(500).json({
                success: false,
                error: 'Export işlemi başarısız',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    // Geçmişi temizle
    async clearHistory(req, res) {
        try {
            summarizationService.clearHistory();
            
            logger.info('Konuşma geçmişi temizlendi');
            
            res.json({
                success: true,
                message: 'Geçmiş başarıyla temizlendi',
                timestamp: Date.now()
            });

        } catch (error) {
            logger.error('Geçmiş temizleme hatası:', error);
            
            res.status(500).json({
                success: false,
                error: 'Geçmiş temizlenemedi',
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
}

module.exports = new TranscriptionController(); 