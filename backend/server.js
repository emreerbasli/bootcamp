// MeetAI Backend Server
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
require('dotenv').config();

// Controllers
const transcriptionController = require('./src/controllers/transcriptionController');

// Utilities
const logger = require('./src/utils/logger');

// Express app oluştur
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS konfigürasyonu
app.use(cors({
    origin: [
        'http://localhost:3000',
        'chrome-extension://*',
        /^chrome-extension:\/\/[a-z]+$/
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
app.use(morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 100, // IP başına maksimum 100 istek
    message: {
        error: 'Çok fazla istek. Lütfen daha sonra tekrar deneyin.',
        retryAfter: '15 dakika'
    },
    standardHeaders: true,
    legacyHeaders: false
});
app.use('/api/', limiter);

// Multer konfigürasyonu (ses dosyaları için)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 1
    },
    fileFilter: (req, file, cb) => {
        // Ses dosyalarını kabul et
        const allowedMimes = [
            'audio/webm',
            'audio/wav',
            'audio/mp3',
            'audio/ogg',
            'audio/mpeg'
        ];
        
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Desteklenmeyen dosya türü'), false);
        }
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    const healthStatus = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'MeetAI Backend',
        version: '1.0.0',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        environment: process.env.NODE_ENV || 'development'
    };
    
    logger.info('Health check requested');
    res.json(healthStatus);
});

// API Routes

// Transkripsiyon endpoint'i
app.post('/api/transcription/process', 
    upload.single('audio'), 
    transcriptionController.processAudio
);

// Özet endpoint'i
app.post('/api/summarization/generate',
    express.json(),
    transcriptionController.generateSummary
);

// Soru-cevap endpoint'i
app.post('/api/qa/ask',
    express.json(),
    transcriptionController.askQuestion
);

// Servis durumu endpoint'i
app.get('/api/transcription/status', transcriptionController.getServiceStatus);

// Full summary endpoint'i
app.get('/api/transcription/full-summary', transcriptionController.getFullSummary);

// Export endpoint'i
app.get('/api/transcription/export', transcriptionController.exportData);

// Clear history endpoint'i
app.post('/api/transcription/clear-history', transcriptionController.clearHistory);

// Session yönetimi
app.post('/api/sessions/start', (req, res) => {
    const sessionData = {
        sessionId: `session_${Date.now()}`,
        startTime: new Date().toISOString(),
        platform: req.body.platform || 'unknown',
        status: 'active'
    };
    
    logger.info(`Session başlatıldı: ${sessionData.sessionId}`);
    res.json({
        success: true,
        data: sessionData
    });
});

app.post('/api/sessions/stop', (req, res) => {
    const { sessionId } = req.body;
    
    logger.info(`Session durduruldu: ${sessionId}`);
    res.json({
        success: true,
        message: 'Session başarıyla durduruldu'
    });
});

// Export endpoint'i
app.post('/api/export', (req, res) => {
    const { format, data } = req.body;
    
    try {
        let exportData;
        
        switch (format) {
            case 'json':
                exportData = JSON.stringify(data, null, 2);
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Content-Disposition', 'attachment; filename="meetai-export.json"');
                break;
                
            case 'txt':
                exportData = data.transcript || '';
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Content-Disposition', 'attachment; filename="meetai-transcript.txt"');
                break;
                
            default:
                throw new Error('Desteklenmeyen format');
        }
        
        res.send(exportData);
        
    } catch (error) {
        logger.error('Export hatası:', error);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint bulunamadı',
        path: req.originalUrl,
        method: req.method
    });
});

// Global error handler
app.use((err, req, res, next) => {
    logger.error('Sunucu hatası:', err);
    
    // Multer hataları
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: 'Dosya boyutu çok büyük (maksimum 10MB)'
            });
        }
    }
    
    // Genel hata yanıtı
    res.status(err.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' 
            ? 'Sunucu hatası oluştu' 
            : err.message,
        timestamp: new Date().toISOString()
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM sinyali alındı, sunucu kapatılıyor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT sinyali alındı, sunucu kapatılıyor...');
    process.exit(0);
});

// Sunucuyu başlat
app.listen(PORT, () => {
    logger.info(`🚀 MeetAI Backend çalışıyor:`);
    logger.info(`   - Port: ${PORT}`);
    logger.info(`   - Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`   - Health Check: http://localhost:${PORT}/api/health`);
    logger.info(`   - API Base: http://localhost:${PORT}/api`);
    
    console.log('\n='.repeat(50));
    console.log('🤖 MeetAI Backend Server Started!');
    console.log('='.repeat(50));
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('='.repeat(50) + '\n');
});

module.exports = app; 