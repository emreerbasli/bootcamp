# PRODUCT BACKLOG - MeetAI

## Proje Bilgileri
- **Proje Adı:** MeetAI - Yapay Zeka Destekli Toplantı Asistanı
- **Takım:** [Takım Adınız]
- **Proje Türü:** Chrome Uzantısı + Web Uygulaması
- **Hedef Kitle:** Uzaktan çalışan profesyoneller, toplantı organizatörleri

## Product Backlog Items (Öncelik Sırasına Göre)

### 🔴 Epic 1: MVP - Temel Sistem (Sprint 1)
**Toplam Tahmin:** 40 Story Points

#### PBI-001: Chrome Uzantısı Kurulumu
- **Açıklama:** Temel Chrome uzantısı yapısını oluştur
- **Öncelik:** Yüksek
- **Story Points:** 8
- **Kabul Kriterleri:**
  - Manifest.json dosyası hazır
  - Popup arayüzü çalışıyor
  - Content script aktif
  - Background script çalışıyor

#### PBI-002: Gerçek Zamanlı Ses Yakalama
- **Açıklama:** Toplantı ses akışını yakalama sistemi
- **Öncelik:** Yüksek
- **Story Points:** 13
- **Kabul Kriterleri:**
  - Google Meet'ten ses yakalama
  - Ses verisi buffer'lama
  - WebSocket bağlantısı kurma

#### PBI-003: Ses-Metin Entegrasyonu
- **Açıklama:** Yakalanan sesi gerçek zamanlı metne çevirme
- **Öncelik:** Yüksek
- **Story Points:** 13
- **Kabul Kriterleri:**
  - Google Speech-to-Text API entegrasyonu
  - Gerçek zamanlı transkripsiyon
  - %90+ doğruluk oranı

#### PBI-004: Basik Backend API
- **Açıklama:** Node.js backend temel yapısı
- **Öncelik:** Yüksek
- **Story Points:** 8
- **Kabul Kriterleri:**
  - Express.js server kurulumu
  - MongoDB bağlantısı
  - Temel endpoint'ler

### 🟡 Epic 2: Temel Özellikler (Sprint 2)
**Toplam Tahmin:** 45 Story Points

#### PBI-005: 5 Saniyede Akıllı Özetler
- **Açıklama:** Her 5 saniyede otomatik özetleme
- **Öncelik:** Orta
- **Story Points:** 13
- **Kabul Kriterleri:**
  - Gemini API entegrasyonu
  - 5 saniyede özet üretimi
  - Özetlerin popup'ta gösterimi

#### PBI-006: Soru-Cevap Bot
- **Açıklama:** Toplantı içeriği hakkında soru sorabilen bot
- **Öncelik:** Orta
- **Story Points:** 21
- **Kabul Kriterleri:**
  - RAG sistemi kurulumu
  - Bağlamsal soru-cevap
  - Chat arayüzü

#### PBI-007: Çoklu Platform Desteği
- **Açıklama:** Zoom ve Teams desteği ekleme
- **Öncelik:** Orta
- **Story Points:** 8
- **Kabul Kriterleri:**
  - Zoom entegrasyonu
  - Teams entegrasyonu
  - Platform algılama

#### PBI-008: Dışa Aktarım
- **Açıklama:** Toplantı özetlerini dışa aktarma
- **Öncelik:** Düşük
- **Story Points:** 5
- **Kabul Kriterleri:**
  - PDF export
  - Word export
  - JSON export

### 🟢 Epic 3: Gelişmiş Özellikler (Sprint 3)
**Toplam Tahmin:** 35 Story Points

#### PBI-009: Toplantı Analitiği
- **Açıklama:** Katılım ve önemli noktaları takip
- **Öncelik:** Düşük
- **Story Points:** 13
- **Kabul Kriterleri:**
  - Katılım metrikleri
  - Konuşma süreleri
  - Önemli nokta tespiti

#### PBI-010: Kullanıcı Kimlik Doğrulama
- **Açıklama:** Güvenli kullanıcı girişi
- **Öncelik:** Orta
- **Story Points:** 8
- **Kabul Kriterleri:**
  - JWT token sistemi
  - Güvenli login
  - Kullanıcı profili

#### PBI-011: Dashboard Arayüzü
- **Açıklama:** React.js ile dashboard geliştirme
- **Öncelik:** Düşük
- **Story Points:** 13
- **Kabul Kriterleri:**
  - React components
  - Toplantı geçmişi
  - İstatistik gösterimi

#### PBI-012: Demo Day Hazırlıkları
- **Açıklama:** Sunum ve demo materyalleri
- **Öncelik:** Yüksek
- **Story Points:** 3
- **Kabul Kriterleri:**
  - Demo senaryosu
  - Sunum slaytları
  - Test verileri

## Teknik Gereksinimler
- **Frontend:** Chrome Extension (Vanilla JS), React.js
- **Backend:** Node.js, Express.js
- **Veritabanı:** MongoDB
- **AI Services:** Google Speech-to-Text, Google Gemini
- **Gerçek Zamanlı:** Socket.io, WebSocket

## Tanımlanmış Bitmiş Kriterleri
- [ ] Kod GitHub'da commit edildi
- [ ] Unit testler yazıldı
- [ ] Fonksiyon çalışıyor
- [ ] Kod review tamamlandı
- [ ] Dokümantasyon güncellendi

## Riskler ve Bağımlılıklar
- **Risk:** API rate limiting
- **Risk:** Ses kalitesi sorunları
- **Bağımlılık:** Google Cloud API anahtarları
- **Bağımlılık:** Chrome uzantısı onayı
