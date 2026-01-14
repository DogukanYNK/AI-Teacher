# KonuşTürk - AI Dil Öğrenme Platformu 🎓🎤

Modern, konuşma odaklı AI destekli dil öğrenme web uygulaması.

## ✨ Yeni Özellikler

### 🔐 Kullanıcı Yönetimi (localStorage)
- ✅ Gerçek kayıt sistemi - email + şifre
- ✅ Giriş yapma sistemi
- ✅ Kullanıcı bilgilerini kaydet (ad, soyad, seviye)
- ✅ Çıkış yapma

### 💾 Geçmiş Konuşmalar
- ✅ Tüm konuşmalar kaydediliyor
- ✅ Sidebar'dan geçmiş konuşmalara erişim
- ✅ Konuşma silme özelliği
- ✅ Otomatik başlık oluşturma (ilk mesajdan)

### 🎤 Konuşma Odaklı UI
- ✅ **Ana özellik**: Büyük mikrofon butonu (24x24 boyut)
- ✅ Mikrofon animasyonu (kayıt sırasında kırmızı + pulse)
- ✅ Konuşma tanıma (Web Speech API)
- ✅ Text input ikincil seçenek (küçük, altta)
- ✅ "Mikrofona bas ve konuş" rehberliği

### 🔊 Ses Özellikleri
- ✅ Her öğretmen için **örnek ses çalma** butonu (Play ikonu)
- ✅ AI mesajlarında hoparlör butonu ile sesi dinle
- ✅ Otomatik ses çalma (hoş geldin mesajı)
- ✅ Text-to-Speech (Web Speech API, Türkçe)

### 🎨 UI İyileştirmeleri
- ✅ Konuşma odaklı tasarım
- ✅ Büyük, merkezi mikrofon butonu
- ✅ Wizard'da ses örnekleri dinleme
- ✅ Geçmiş konuşmalar sidebar
- ✅ Responsive mobile design

## 🚀 Kullanım

### Başlatma
```bash
cd ai-language-learning
npm run dev
```

Tarayıcıda: http://localhost:3000

### İlk Kullanım
1. Ana sayfadan "Ücretsiz Dene" tıkla
2. Email + şifre ile kaydol
3. Ad, soyad, seviye bilgilerini gir
4. Wizard'ı tamamla:
   - Dil seç
   - Öğretmen seç (🔊 ses örneğini dinle!)
   - Amaç seç
   - Seviye belirle
5. 🎤 Mikrofona bas ve konuşmaya başla!

### Konuşma Kullanımı
- **Birincil**: 🎤 Mikrofon butonuna bas → Konuş → Otomatik gönderilir
- **İkincil**: Alttaki text input'a yaz → Enter veya Send butonu

### Özellikler
- 💬 Geçmiş konuşmalar: Sol üstteki menü (☰)
- 🔊 AI mesajlarını dinle: Hoparlör ikonuna tıkla
- 🗑️ Konuşma sil: Sidebar'da konuşmanın üzerine gel
- 🚪 Çıkış yap: Sağ üstteki çıkış ikonu

## 📁 Dosya Yapısı

```
src/
├── app/
│   ├── page.tsx                # Ana sayfa (login/register)
│   ├── onboarding/page.tsx     # Kullanıcı bilgileri
│   └── chat/page.tsx           # Chat arayüzü ⭐
├── lib/
│   └── storage.ts              # localStorage servisi ⭐
└── ...

API_GUIDE.md                    # Backend API rehberi ⭐
```

## 🔧 Teknik Detaylar

### localStorage Yapısı
- `konusturk_users`: Kullanıcı listesi
- `konusturk_current_user`: Aktif kullanıcı
- `konusturk_chat_sessions`: Tüm konuşmalar

### Web API'ler
- **Speech Recognition**: Konuşma tanıma (webkitSpeechRecognition)
- **Speech Synthesis**: Text-to-Speech (SpeechSynthesisUtterance)

### Veriler
Tüm veriler tarayıcıda localStorage'da saklanıyor:
- ✅ **Artı**: Hızlı, offline çalışır, kurulum gerektirmez
- ⚠️ **Eksi**: Tarayıcı temizlenirse silinir, cihazlar arası senkron yok

## 🔄 API Entegrasyonu (Yapılıcaklar...)

### Backend'e Geçiş İçin
1. **API_GUIDE.md** dosyasını oku ⭐
2. Backend API'yi kur (Node.js + PostgreSQL önerili)
3. OpenAI/Gemini API'sini entegre et
4. `src/lib/storage.ts` yerine `src/lib/api.ts` kullan
5. Environment variables ayarla

### Gerekli API'ler
- `/api/auth/*` - Authentication
- `/api/chat/sessions` - Konuşma yönetimi
- `/api/ai/chat` - AI yanıtları (OpenAI/Gemini)
- `/api/speech/*` - TTS/STT (opsiyonel)

## 🎯 Sonraki Adımlar
- [ ] Gerçek AI entegrasyonu (OpenAI API)
- [ ] Backend API kurulumu
- [ ] Database (PostgreSQL/Supabase)
- [ ] Çeviri API'si
- [ ] Daha kaliteli TTS (Azure)

## 📊 Maliyet (Backend ile)

### Başlangıç (~$70-250/ay)
- Database + Auth: $0-25
- OpenAI API: $60-150
- Hosting: $0-20
- Speech API (opsiyonel): $10-50

### Ücretsiz Alternatifler
- Web Speech API ✅ Şu anda kullanılıyor
- Supabase Free tier
- Vercel hosting

## 🐛 Bilinen Sınırlamalar

1. **localStorage**: Tarayıcı temizlenirse veriler silinir
2. **Web Speech API**: Sadece Chrome/Edge'de çalışır
3. **AI Simülasyonu**: Şu anda gerçek AI yok (demo yanıtlar)
4. **Çeviri**: Hardcoded örnek çeviriler

## 💡 İpuçları

- Chrome veya Edge kullan (ses özelliği için)
- Mikrofon izni ver
- Sessiz ortamda konuş
- localStorage'ı sakla

---

**Geliştirici**: GitHub Copilot + Doğukan
**Tech Stack**: Next.js 14, TypeScript, Tailwind, Framer Motion
**Versiyon**: 2.0.0
