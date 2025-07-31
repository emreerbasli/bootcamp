# USER STORIES - MeetAI

## Kullanıcı Profilleri

### Birincil Kullanıcı: İş Profesyoneli
- Remote çalışan
- Günde 3-5 toplantı yapan
- Verimlilik odaklı
- Teknoloji savvy

### İkincil Kullanıcı: Öğrenci
- Online derslere katılan
- Not alma zorluğu yaşayan
- Dijital araçları aktif kullanan

### Üçüncül Kullanıcı: Proje Yöneticisi
- Takım toplantıları organize eden
- Raporlama sorumluluğu olan
- Zaman yönetimi kritik

## Epic 1: Temel Toplantı Desteği

### US-001: Chrome Uzantısı Kurulumu
**Kullanıcı Olarak** Chrome tarayıcımda MeetAI uzantısını kurmak **İstiyorum Ki** toplantılarımda yapay zeka desteği alabilirim.

**Kabul Kriterleri:**
- Uzantı Chrome Web Store'dan indirilebilir
- Kurulum 3 adımda tamamlanır
- Kurulum sonrası popup açılır ve çalışır durumda olur

**Kriter Testleri:**
- [ ] Uzantı Chrome'da görünür
- [ ] Popup açılabilir
- [ ] Gerekli izinler alınır

### US-002: Gerçek Zamanlı Ses Yakalama
**Kullanıcı Olarak** toplantı sırasında sesimi yakalamak **İstiyorum Ki** konuşmalarım metne dönüştürülsün.

**Kabul Kriterleri:**
- Mikrofon erişimi izni alınır
- Ses akışı kesintisiz yakalanır
- Ses kalitesi yeterli seviyede işlenir

**Kriter Testleri:**
- [ ] Mikrofon erişimi çalışır
- [ ] Ses akışı başlatılır/durdurulur
- [ ] Ses seviyesi gösterilir

### US-003: Ses-Metin Dönüşümü
**Kullanıcı Olarak** konuşmalarımın gerçek zamanlı olarak metne dönüştürülmesini **İstiyorum Ki** ne konuştuğumu görebileyim.

**Kabul Kriterleri:**
- Transkripsiyon 2 saniye gecikmeyle görünür
- Doğruluk oranı %90 üzerinde
- Türkçe dil desteği çalışır

**Kriter Testleri:**
- [ ] Metin gerçek zamanlı güncellenir
- [ ] Doğruluk kabul edilebilir seviyede
- [ ] Türkçe karakterler düzgün görünür

### US-004: Basit Özetleme
**Kullanıcı Olarak** toplantı içeriğinin özetini görmek **İstiyorum Ki** önemli noktaları kaçırmayayım.

**Kabul Kriterleri:**
- Özet 30 saniyede bir güncellenir
- Özet 3-5 cümle uzunluğunda
- Anahtar kelimeler vurgulanır

**Kriter Testleri:**
- [ ] Özet otomatik oluşturulur
- [ ] Özet anlaşılır ve tutarlı
- [ ] Güncelleme zamanında gerçekleşir

### US-005: Temel Kullanıcı Arayüzü
**Kullanıcı Olarak** uzantıyı kolayca kontrol etmek **İstiyorum Ki** toplantı sırasında dikkatim dağılmasın.

**Kabul Kriterleri:**
- Başlat/Durdur düğmeleri açık
- Durum göstergeleri net
- Arayüz responsive

**Kriter Testleri:**
- [ ] Düğmeler çalışır
- [ ] Durumlar görsel olarak net
- [ ] Arayüz farklı ekran boyutlarında çalışır

## Epic 2: Gelişmiş Özellikler

### US-006: 5 Saniyede Akıllı Özetler
**Kullanıcı Olarak** her 5 saniyede güncelleşen akıllı özetler görmek **İstiyorum Ki** toplantının gidişatını sürekli takip edebileyim.

**Kabul Kriterleri:**
- Özet her 5 saniyede güncellenir
- Yeni bilgiler öncekilerle birleştirilir
- Önemli değişiklikler vurgulanır

**Kriter Testleri:**
- [ ] Zamanlama doğru çalışır
- [ ] Özetler mantıklı şekilde birleşir
- [ ] Değişiklikler görsel olarak belirtilir

### US-007: Soru-Cevap Botu
**Kullanıcı Olarak** toplantı içeriği hakkında soru sorabilmek **İstiyorum Ki** kaçırdığım noktaları öğrenebileyim.

**Kabul Kriterleri:**
- Chatbot arayüzü çalışır
- Sorular anlamlı yanıtlanır
- Yanıtlar toplantı içeriğine dayalı

**Kriter Testleri:**
- [ ] Soru sorma arayüzü çalışır
- [ ] Yanıtlar doğru ve ilgili
- [ ] Yanıt süresi 3 saniye altında

### US-008: Çoklu Platform Desteği
**Kullanıcı Olarak** farklı toplantı platformlarında aynı deneyimi yaşamak **İstiyorum Ki** hangi platformu kullanırsam kullanayayım destek alabilirim.

**Kabul Kriterleri:**
- Google Meet desteği çalışır
- Zoom desteği çalışır
- Teams desteği çalışır

**Kriter Testleri:**
- [ ] Her platformda uzantı çalışır
- [ ] Ses yakalama tutarlı
- [ ] Arayüz platform uyumlu

### US-009: Dışa Aktarım
**Kullanıcı Olarak** toplantı özetlerini farklı formatlarda indirebilmek **İstiyorum Ki** başkalarıyla paylaşabileyim.

**Kabul Kriterleri:**
- PDF formatında export
- Word formatında export
- JSON formatında export

**Kriter Testleri:**
- [ ] PDF doğru formatlanır
- [ ] Word açılabilir
- [ ] JSON geçerli format

### US-010: Kullanıcı Hesabı
**Kullanıcı Olarak** geçmiş toplantılarımı kaydedebilmek **İstiyorum Ki** daha sonra erişebiliyim.

**Kabul Kriterleri:**
- Giriş/çıkış sistemi çalışır
- Toplantı geçmişi kaydedilir
- Veriler güvenli şekilde saklanır

**Kriter Testleri:**
- [ ] Hesap oluşturma çalışır
- [ ] Giriş/çıkış sorunsuz
- [ ] Geçmiş toplantılar listelenebilir

## Story Points Tahmini

### Sprint 1 (Toplam: 25 points)
- US-001: 5 points
- US-002: 8 points
- US-003: 5 points
- US-004: 4 points
- US-005: 3 points

### Sprint 2 (Toplam: 30 points)
- US-006: 8 points
- US-007: 13 points
- US-008: 5 points
- US-009: 4 points

### Sprint 3 (Toplam: 15 points)
- US-010: 8 points
- Entegrasyon ve test: 4 points
- Dokümantasyon: 3 points

## Definition of Done
Her user story için:
- [ ] Kod yazılmış ve test edilmiş
- [ ] Kabul kriterleri karşılanmış
- [ ] Code review yapılmış
- [ ] Dokümantasyon güncellenmiş
- [ ] Product Owner onayı alınmış
