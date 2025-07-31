# SPRINT 1 PLANNING - MeetAI

## Sprint Bilgileri
- **Sprint No:** 1
- **Sprint Süresi:** 20 Haziran - 6 Temmuz (2 hafta)
- **Takım:** DataTwins (Yusuf Çınar, Tuğberk Şentepe)
- **Sprint Hedefi:** MVP (Minimum Viable Product) geliştirmek

## Sprint Hedefi
Bu sprint sonunda çalışan bir Chrome uzantısı olacak ve kullanıcılar:
- Uzantıyı kurabilecek
- Toplantı sesini yakalayabilecek
- Gerçek zamanlı transkripsiyon görebilecek
- Basit özetler alabilecek
- Temel arayüzü kullanabilecek

## Sprint Backlog

### US-001: Chrome Uzantısı Kurulumu (5 points)
**Görevler:**
- [ ] Manifest.json dosyası oluşturma (Yusuf - 4 saat)
- [ ] Popup HTML/CSS yapısı (Tuğberk - 3 saat)
- [ ] Content script kurulumu (Yusuf - 3 saat)
- [ ] Background script (Tuğberk - 2 saat)
- [ ] İzinler ve güvenlik ayarları (Yusuf - 2 saat)

**Toplam:** 14 saat

### US-002: Gerçek Zamanlı Ses Yakalama (8 points)
**Görevler:**
- [ ] Mikrofon erişimi API entegrasyonu (Tuğberk - 6 saat)
- [ ] Ses akışı yakalama (Yusuf - 5 saat)
- [ ] Ses veri işleme (Tuğberk - 4 saat)
- [ ] Ses kalitesi optimizasyonu (Yusuf - 3 saat)
- [ ] Hata yönetimi (Tuğberk - 2 saat)

**Toplam:** 20 saat

### US-003: Ses-Metin Dönüşümü (5 points)
**Görevler:**
- [ ] Speech-to-Text API seçimi ve kurulumu (Yusuf - 4 saat)
- [ ] API entegrasyonu (Tuğberk - 5 saat)
- [ ] Gerçek zamanlı transkripsiyon (Yusuf - 4 saat)
- [ ] Metin görüntüleme arayüzü (Tuğberk - 3 saat)

**Toplam:** 16 saat

### US-004: Basit Özetleme (4 points)
**Görevler:**
- [ ] LLM API entegrasyonu (Yusuf - 5 saat)
- [ ] Özetleme algoritması (Tuğberk - 4 saat)
- [ ] Özetlerin arayüzde gösterilmesi (Yusuf - 3 saat)
- [ ] Güncelleme mekanizması (Tuğberk - 2 saat)

**Toplam:** 14 saat

### US-005: Temel Kullanıcı Arayüzü (3 points)
**Görevler:**
- [ ] Başlat/Durdur düğmeleri (Tuğberk - 2 saat)
- [ ] Durum göstergeleri (Yusuf - 3 saat)
- [ ] Responsive tasarım (Tuğberk - 4 saat)
- [ ] CSS styling (Yusuf - 3 saat)

**Toplam:** 12 saat

## Toplam Tahmin
- **Story Points:** 25 points
- **Toplam Saat:** 76 saat
- **Kişi Başına:** 38 saat (2 hafta)
- **Günlük Ortalama:** 2.7 saat/gün/kişi

## Sprint Capacity
- **Takım Üyesi 1 (Yusuf):** 40 saat (20 saat/hafta)
- **Takım Üyesi 2 (Tuğberk):** 40 saat (20 saat/hafta)
- **Toplam Capacity:** 80 saat

## Risk ve Varsayımlar

### Riskler
1. **Yüksek Risk:** API limitleri ve maliyetleri
2. **Orta Risk:** Tarayıcı güvenlik politikaları
3. **Düşük Risk:** Ses kalitesi sorunları

### Varsayımlar
- API'ler stabil çalışacak
- Geliştirme ortamında sorun yaşanmayacak
- Takım üyeleri planlanan süre ayırabilecek

## Başarı Kriterleri
- Tüm user story'ler tamamlanacak
- Demo yapılabilir durumda çalışan uzantı
- Kod kalitesi standartlarına uygun
- Temel fonksiyonlar çalışıyor

## Daily Scrum Planı
- **Zaman:** Her gün 09:00
- **Süre:** 15 dakika
- **Format:** 
  - Dün ne yaptım?
  - Bugün ne yapacağım?
  - Herhangi bir engel var mı?

## Sprint Review Planı
- **Tarih:** 6 Temmuz
- **Süre:** 1 saat
- **Katılımcılar:** Takım üyeleri
- **Demo:** Çalışan uzantı gösterimi

## Sprint Retrospective Planı
- **Tarih:** 6 Temmuz (Review sonrası)
- **Süre:** 30 dakika
- **Format:** 
  - Neyi iyi yaptık?
  - Neyi geliştirebiliriz?
  - Sonraki sprint için aksiyonlar

## Teknoloji Kararları

### Frontend
- Vanilla JavaScript (Chrome uzantısı için)
- HTML5 + CSS3
- Chrome Extension API'leri

### Backend/API
- Node.js (gerekirse)
- Google Speech-to-Text API
- Google Gemini API

### Araçlar
- Git version control
- Chrome Developer Tools
- Postman (API test için)

## Definition of Done
Her user story için:
- [ ] Kod yazılmış ve lokal test edilmiş
- [ ] Kabul kriterleri karşılanmış
- [ ] Code review yapılmış (takım içi)
- [ ] Chrome'da test edilmiş
- [ ] GitHub'a commit edilmiş
- [ ] Dokümantasyon güncellenmiş

## Sprint Commitment
Takım olarak 25 story point'i bu sprint'te tamamlamayı taahhüt ediyoruz.
