// MeetAI Logger Utility
const winston = require('winston');
const path = require('path');

// Log formatı
const logFormat = winston.format.combine(
    winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, stack }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
    })
);

// Logger oluştur
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: logFormat,
    defaultMeta: { service: 'meetai-backend' },
    transports: [
        // Console output
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            )
        })
    ],
});

// Production'da dosya logları
if (process.env.NODE_ENV === 'production') {
    logger.add(new winston.transports.File({
        filename: path.join(__dirname, '../../logs/error.log'),
        level: 'error'
    }));
    
    logger.add(new winston.transports.File({
        filename: path.join(__dirname, '../../logs/combined.log')
    }));
}

module.exports = logger; 