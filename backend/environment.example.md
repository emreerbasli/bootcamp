# MeetAI Backend Ortam Değişkenleri

Backend klasöründe `.env` dosyası oluşturup aşağıdaki değişkenleri tanımlayın:

```bash
# MeetAI Backend Environment Variables

# Server Configuration
NODE_ENV=development
PORT=3000
HOST=localhost

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,chrome-extension://*

# Google Cloud Speech-to-Text (Opsiyonel)
# GOOGLE_APPLICATION_CREDENTIALS=./credentials/google-cloud-key.json
# GOOGLE_PROJECT_ID=your-google-project-id

# OpenAI Configuration (Opsiyonel - Demo için mock kullanılır)
# OPENAI_API_KEY=sk-your-openai-api-key-here
OPENAI_MODEL=gpt-4o
OPENAI_MAX_TOKENS=500

# Gemini AI (Alternatif - Gelecek özellik)
# GEMINI_API_KEY=your-gemini-api-key-here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Logging Configuration
LOG_LEVEL=info

# Audio Processing
AUDIO_SAMPLE_RATE=16000
AUDIO_CHANNELS=1
CHUNK_DURATION_MS=5000

# AI Configuration
SUMMARIZATION_INTERVAL_SECONDS=30
CONFIDENCE_THRESHOLD=0.7
MAX_CONVERSATION_HISTORY=1000

# Development Settings
DEBUG=true
VERBOSE_LOGGING=true
```

## 📝 Notlar

- **Mock Servisler**: Proje API anahtarları olmadan da çalışır
- **Production**: Gerçek API anahtarları için yukarıdaki commented satırları açın
- **Güvenlik**: .env dosyasını asla git'e commit etmeyin

## 🔑 API Anahtarları Nasıl Alınır

### OpenAI API Key
1. https://platform.openai.com/ adresine gidin
2. Account → API Keys
3. "Create new secret key" tıklayın

### Google Cloud Speech-to-Text
1. Google Cloud Console'da proje oluşturun
2. Speech-to-Text API'yi aktifleştirin  
3. Service Account oluşturun ve JSON key indirin 