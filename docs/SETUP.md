# MeetAI Kurulum ve Çalıştırma Rehberi

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js (v18+)
- Chrome Tarayıcısı
- Git

### 1. Projeyi Klonlayın
```bash
git clone <repository-url>
cd meetai
```

### 2. Backend Kurulumu

#### 2.1. Bağımlılıkları Yükleyin
```bash
cd backend
npm install
```

#### 2.2. Ortam Değişkenlerini Ayarlayın
```bash
# .env dosyası oluşturun
cp .env.example .env

# Gerekli API anahtarlarını ekleyin (opsiyonel):
# OPENAI_API_KEY=your-openai-api-key
# GOOGLE_APPLICATION_CREDENTIALS=path-to-google-credentials.json
```

#### 2.3. Backend'i Başlatın
```bash
# Development mode
npm run dev

# Production mode  
npm start
```

Backend çalışıyorsa: http://localhost:3000/api/health

### 3. Chrome Uzantısı Kurulumu

#### 3.1. Chrome'u Açın
- Chrome'u açın
- Adres çubuğuna `chrome://extensions/` yazın

#### 3.2. Developer Mode'u Aktifleştirin
- Sağ üst köşede "Developer mode" toggle'ını açın

#### 3.3. Uzantıyı Yükleyin
- "Load unpacked" butonuna tıklayın
- `chrome-extension` klasörünü seçin
- MeetAI uzantısı yüklenecek

### 4. Test Etme

#### 4.1. Google Meet'te Test
1. https://meet.google.com/ adresine gidin
2. Bir toplantı oluşturun veya katılın  
3. MeetAI uzantısı ikonuna tıklayın
4. "Başlat" düğmesine basın
5. Mikrofon izni verin
6. Konuşmaya başlayın - transkripsiyon görünecek

#### 4.2. Backend Test
```bash
# Health check
curl http://localhost:3000/api/health

# Test audio upload (form-data gerekli)
# Postman veya benzer araç kullanın
```

## 🔧 Geliştirme

### Backend Development
```bash
cd backend
npm run dev  # Nodemon ile otomatik restart
```

### Chrome Extension Development
- Kod değişikliklerinden sonra `chrome://extensions/` da reload yapın
- Console loglarını Chrome DevTools'da görebilirsiniz

### Debug
- Backend logs: Console'da görünür
- Chrome Extension logs: 
  - Popup: Popup'a sağ tıklayıp "Inspect" 
  - Content Script: Sayfa DevTools Console
  - Background: Extensions sayfasında "Inspect views"

## 📋 Özellik Durumu

### ✅ Tamamlanan
- Chrome uzantısı (Manifest V3) ✅
- Modern popup arayüzü ✅
- Ses yakalama sistemi ✅
- Backend API (Express.js) ✅
- Mock transkripsiyon ve özetleme ✅
- **YENİ:** Soru-cevap botu ✅
- **YENİ:** QA Bot servisi ✅
- CORS konfigürasyonu ✅
- Error handling ve logging ✅

### 🔄 Geliştirme Aşamasında
- Google Speech-to-Text entegrasyonu (API key ile aktif)
- OpenAI/GPT entegrasyonu (API key ile aktif)
- Dışa aktarım özellikleri (temel JSON/TXT hazır)

### 📋 Planlanan
- Multi-platform desteği (Zoom, Teams)
- Kullanıcı hesapları
- Toplantı geçmişi
- Gelişmiş analizler

## 🐛 Bilinen Sorunlar

1. **İkon Dosyaları**: Uzantı ikonları henüz eklenmedi
2. **API Keys**: Gerçek AI servisleri için API anahtarı gerekli
3. **CORS**: Bazı durumlarda CORS sorunları yaşanabilir

## 🔑 API Anahtarları

### OpenAI API Key
1. https://platform.openai.com/ 'a gidin
2. API Key oluşturun
3. `.env` dosyasına `OPENAI_API_KEY=...` ekleyin

### Google Cloud Speech-to-Text
1. Google Cloud Console'da proje oluşturun
2. Speech-to-Text API'yi aktifleştirin
3. Service Account oluşturup JSON key indirin
4. `.env` dosyasına path ekleyin

## 📞 Destek

Sorun yaşıyorsanız:
1. Console loglarını kontrol edin
2. Backend health check yapın
3. Chrome extension reload edin

## 🎯 Demo Day Hazırlığı

### Test Senaryosu
1. Google Meet toplantısına katılın
2. MeetAI'yi başlatın
3. Konuşmayı başlatın
4. Gerçek zamanlı transkripsiyon gösterin
5. Özet özelliğini gösterin
6. Export işlemini yapın

### Backup Plan
- Mock verilerle demo yapın
- Önceden hazırlanmış transkripsiyon kullanın
- Video kayıt hazırlayın 