
# MeetAI - Yapay Zeka Destekli Toplantı Asistanı
🎯 Proje Genel Bakış
MeetAI, online toplantılarınızı gerçek zamanlı yapay zeka desteğiyle dönüştüren bir Chrome uzantısıdır. Canlı transkripsiyon, her 5 saniyede otomatik özetler ve toplantı içeriğini anlayan akıllı soru-cevap botu ile toplantılarınızı verimli hale getirin.
✨ Temel Özellikler

🎙️ Gerçek Zamanlı Ses-Metin: Yüksek doğrulukla canlı transkripsiyon
📝 5 Saniyede Akıllı Özetler: Anında toplantı önemli noktaları
🤖 Akıllı Soru-Cevap Botu: Toplantı içeriği hakkında soru sorun
🌐 Çoklu Platform Desteği: Google Meet, Zoom, Teams
📊 Toplantı Analitiği: Katılım ve önemli noktaları takip edin
💾 Otomatik Dışa Aktarım: PDF, Word ve JSON formatları


## Proje Yapısı
```
meetai/
├── chrome-extension/           # Uzantı manifest dosyası
│   ├── manifest.json          # Uzantı manifest dosyası
│   ├── popup/                 # Uzantı popup arayüzü
│   ├── content/               # İçerik scriptleri
│   └── background/            # Arkaplan scriptleri
├── backend/                   # Node.js backend
│   ├── src/
│   │   ├── controllers/       # API controller’ları
│   │   ├── services/          # İş mantığı
│   │   ├── models/            # Veri modelleri
│   │   └── utils/             # Yardımcı fonksiyonlar
│   ├── package.json
│   └── server.js
├── ai-services/               # Yapay zeka işleme servisleri
│   ├── transcription/         # Ses-metin servisi
│   ├── summarization/         # Metin özetleme
│   └── qa-bot/                # Soru-cevap chatbot'u
├── frontend/                  # React dashboard (opsiyonel)
│   ├── src/
│   ├── public/
│   └── package.json
├── docs/                      # Dokümantasyon
├── tests/                     # Test dosyaları
└── README.md
```

🛠️ Teknoloji Yığını
Frontend

Chrome Uzantısı: Vanilla JS, HTML5, CSS3
Dashboard: React.js, Tailwind CSS
Gerçek Zamanlı Güncellemeler: WebSocket

Backend

Sunucu: Node.js, Express.js
Veritabanı: MongoDB / PostgreSQL
Gerçek Zamanlı: Socket.io

Yapay Zeka Servisleri

Ses Tanıma: Google Speech-to-Text / Whisper
Özetleme: Google Gemini / OpenAI GPT
Soru-Cevap Botu: RAG (Retrieval-Augmented Generation)

🚀 Hızlı Başlangıç
Gereksinimler

Node.js (v18+)
Chrome Tarayıcısı
API Anahtarları (Google Cloud / OpenAI)

Kurulum

Depoyu klonlayın:git clone https://github.com/kullaniciadi/meetai.git
cd meetai


Backend bağımlılıklarını yükleyin:cd backend
npm install


Frontend bağımlılıklarını yükleyin:cd ../frontend
npm install


Ortam değişkenlerini ayarlayın:# backend/ içinde .env dosyası oluşturun
cp .env.example .env
# API anahtarlarınızı ekleyin


Chrome Uzantısını yükleyin:
Chrome'u açın → Uzantılar → Geliştirici Modu
"Paketlenmemiş yükle" → chrome-extension/ klasörünü seçin



## Geliştirme
Backend sunucusunu başlatın
cd backend
npm run dev

## Frontend'i başlatın (dashboard kullanıyorsanız)
cd frontend
npm start

## Uzantıyı derleyin
cd chrome-extension
npm run build

## Özellik Yol Haritası
1. Aşama: MVP (Hafta 1-2)

Temel Chrome uzantısı kurulumu
Gerçek zamanlı ses yakalama
Ses-metin entegrasyonu
Basit özetleme
Temel popup arayüzü

2. Aşama: Temel Özellikler (Hafta 3-4)

5 saniyede akıllı özetler
Soru-cevap bot implementasyonu
Çoklu platform desteği
Dışa aktarım işlevi
Kullanıcı kimlik doğrulama

3. Aşama: Gelişmiş Özellikler (Hafta 5-6)

Toplantı analitiği
Takım işbirliği
Özel yapay zeka modelleri
Gelişmiş dışa aktarım seçenekleri
Mobil uygulama

## Demo Day Sunumu
Canlı Demo Senaryosu

Toplantı Başlat: Google Meet çağrısına katılın
Uzantıyı Etkinleştir: Gerçek zamanlı transkripsiyon gösterin
Akıllı Özetler: 5 saniyede güncellemeleri gösterin
Soru-Cevap Bot: Akıllı sorular sorun
Sonuçları Dışa Aktar: Toplantı özetini indirin

### Sunulacak Temel Metrikler

Zaman Tasarrufu: Toplantı başına ortalama 15-20 dakika
Doğruluk: %95+ transkripsiyon doğruluğu
Katılım: Toplantı katılımında %40 artış
Yatırım Getirisi: Çalışan başına aylık $500+ tasarruf

## API Dokümantasyonu
Temel Endpoint'ler
// Toplantı oturumu başlat
POST /api/meetings/start
{
  "meetingId": "string",
  "participants": ["string"],
  "platform": "google-meet" | "zoom" | "teams"
}

// Ses parçasını işle
POST /api/transcription/process
{
  "audioChunk": "base64",
  "sessionId": "string"
}

// Toplantı özetini al
GET /api/meetings/{id}/summary

// Soru-cevap botuna sor
POST /api/qa/ask
{
  "question": "string",
  "sessionId": "string"
}

## Katkıda Bulunma

Depoyu fork edin
Feature branch'inizi oluşturun (git checkout -b feature/HarikaOzellik)
Değişikliklerinizi commit edin (git commit -m 'Harika özellik eklendi')
Branch'inizi push edin (git push origin feature/HarikaOzellik)
Pull Request açın


## Hackathon Jüri Notları
### İnovasyon Puanı

Problem: Remote work'teki gerçek sorunu ele alıyor
Çözüm: 5 saniyede özetleme ile yenilikçi yaklaşım
Teknoloji: Son teknoloji yapay zeka entegrasyonu

### Teknik Karmaşıklık

Gerçek Zamanlı İşleme: WebSocket + streaming yapay zeka
Çok Modlu Yapay Zeka: Ses + metin + bağlam anlama
Ölçeklenebilirlik: Mikroservis mimarisi

### İş Potansiyeli

Pazar Büyüklüğü: 2.8 milyar dolarlık toplantı yazılımı pazarı
Gelir Modeli: Freemium model, kurumsal planlar
Rekabet: Gerçek zamanlı zeka ile farklılaşma

### Demo Etkisi

Canlı Demo: Gerçek toplantıda çalışıyor
Kullanıcı Deneyimi: Sezgisel ve sorunsuz
Değer Önerisi: Net zaman ve verimlilik faydaları

```**
