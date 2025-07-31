# SPRINT 1 BACKLOG - MeetAI

## Sprint Genel Bilgileri
- **Sprint:** 1 / 3
- **Tarih:** 20 Haziran - 6 Temmuz 2024
- **Takım:** DataTwins
- **Sprint Hedefi:** MVP Chrome uzantısı geliştirmek

## Sprint Backlog Items

### 1. US-001: Chrome Uzantısı Kurulumu
**Story Points:** 5 | **Durum:** To Do

#### Görevler:
| Görev | Sorumlu | Tahmini Süre | Durum | Başlangıç | Bitiş |
|-------|---------|--------------|--------|-----------|-------|
| Manifest.json oluşturma | Yusuf | 4 saat | To Do | | |
| Popup HTML/CSS yapısı | Tuğberk | 3 saat | To Do | | |
| Content script kurulumu | Yusuf | 3 saat | To Do | | |
| Background script | Tuğberk | 2 saat | To Do | | |
| İzinler ve güvenlik | Yusuf | 2 saat | To Do | | |

**Kabul Kriterleri:**
- [ ] Uzantı Chrome'da yüklenebilir
- [ ] Popup açılabilir
- [ ] Gerekli izinler alınır
- [ ] Temel yapı çalışır

---

### 2. US-002: Gerçek Zamanlı Ses Yakalama
**Story Points:** 8 | **Durum:** To Do

#### Görevler:
| Görev | Sorumlu | Tahmini Süre | Durum | Başlangıç | Bitiş |
|-------|---------|--------------|--------|-----------|-------|
| Mikrofon erişimi API | Tuğberk | 6 saat | To Do | | |
| Ses akışı yakalama | Yusuf | 5 saat | To Do | | |
| Ses veri işleme | Tuğberk | 4 saat | To Do | | |
| Ses kalitesi optimizasyonu | Yusuf | 3 saat | To Do | | |
| Hata yönetimi | Tuğberk | 2 saat | To Do | | |

**Kabul Kriterleri:**
- [ ] Mikrofon erişimi çalışır
- [ ] Ses akışı başlatılır/durdurulur
- [ ] Ses seviyesi gösterilir
- [ ] Hata durumları yönetilir

---

### 3. US-003: Ses-Metin Dönüşümü
**Story Points:** 5 | **Durum:** To Do

#### Görevler:
| Görev | Sorumlu | Tahmini Süre | Durum | Başlangıç | Bitiş |
|-------|---------|--------------|--------|-----------|-------|
| Speech-to-Text API kurulumu | Yusuf | 4 saat | To Do | | |
| API entegrasyonu | Tuğberk | 5 saat | To Do | | |
| Gerçek zamanlı transkripsiyon | Yusuf | 4 saat | To Do | | |
| Metin görüntüleme arayüzü | Tuğberk | 3 saat | To Do | | |

**Kabul Kriterleri:**
- [ ] Metin gerçek zamanlı güncellenir
- [ ] Doğruluk %85 üzerinde
- [ ] Türkçe dil desteği
- [ ] Gecikme 3 saniye altında

---

### 4. US-004: Basit Özetleme
**Story Points:** 4 | **Durum:** To Do

#### Görevler:
| Görev | Sorumlu | Tahmini Süre | Durum | Başlangıç | Bitiş |
|-------|---------|--------------|--------|-----------|-------|
| LLM API entegrasyonu | Yusuf | 5 saat | To Do | | |
| Özetleme algoritması | Tuğberk | 4 saat | To Do | | |
| Özetlerin arayüzde gösterimi | Yusuf | 3 saat | To Do | | |
| Güncelleme mekanizması | Tuğberk | 2 saat | To Do | | |

**Kabul Kriterleri:**
- [ ] Özet otomatik oluşturulur
- [ ] Özet anlaşılır ve tutarlı
- [ ] 30 saniyede bir güncellenir
- [ ] Anahtar kelimeler vurgulanır

---

### 5. US-005: Temel Kullanıcı Arayüzü
**Story Points:** 3 | **Durum:** To Do

#### Görevler:
| Görev | Sorumlu | Tahmini Süre | Durum | Başlangıç | Bitiş |
|-------|---------|--------------|--------|-----------|-------|
| Başlat/Durdur düğmeleri | Tuğberk | 2 saat | To Do | | |
| Durum göstergeleri | Yusuf | 3 saat | To Do | | |
| Responsive tasarım | Tuğberk | 4 saat | To Do | | |
| CSS styling | Yusuf | 3 saat | To Do | | |

**Kabul Kriterleri:**
- [ ] Düğmeler çalışır
- [ ] Durumlar görsel olarak net
- [ ] Arayüz responsive
- [ ] Kullanıcı dostu tasarım

---

## Sprint Özeti

### Toplam İstatistikler
- **Toplam Story Points:** 25
- **Toplam Görev Sayısı:** 19
- **Toplam Tahmini Süre:** 76 saat
- **Kişi Başına Süre:** 38 saat

### Sorumluluk Dağılımı
| Kişi | Görev Sayısı | Toplam Süre | Günlük Ortalama |
|------|-------------|-------------|-----------------|
| Yusuf | 9 | 36 saat | 2.6 saat/gün |
| Tuğberk | 10 | 40 saat | 2.9 saat/gün |

### Sprint Burndown Chart (Planlanmış)
```
Story Points Remaining:
Gün 1: 25 points
Gün 3: 22 points  
Gün 5: 18 points
Gün 7: 13 points
Gün 9: 8 points
Gün 11: 3 points
Gün 14: 0 points
```

## Daily Scrum Tracking

### Hafta 1
**20-21 Haziran (Hafta Sonu)**
- Kurulum ve ortam hazırlığı
- Chrome uzantısı temel yapısı

**24 Haziran (Pazartesi)**
- Daily Scrum: 09:00
- Planlanan: US-001 başlangıç

**25 Haziran (Salı)**
- Daily Scrum: 09:00
- Planlanan: US-001 devam, US-002 başlangıç

**26 Haziran (Çarşamba)**
- Daily Scrum: 09:00
- Planlanan: US-002 devam

**27 Haziran (Perşembe)**
- Daily Scrum: 09:00
- Planlanan: US-002 bitiş, US-003 başlangıç

**28 Haziran (Cuma)**
- Daily Scrum: 09:00
- Planlanan: US-003 devam

### Hafta 2
**1 Temmuz (Pazartesi)**
- Daily Scrum: 09:00
- Planlanan: US-003 bitiş, US-004 başlangıç

**2 Temmuz (Salı)**
- Daily Scrum: 09:00
- Planlanan: US-004 devam

**3 Temmuz (Çarşamba)**
- Daily Scrum: 09:00
- Planlanan: US-004
