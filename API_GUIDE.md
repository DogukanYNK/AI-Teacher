# KonuşTürk API Entegrasyon Rehberi

## Gerekli API Endpoint'leri

### 1. Authentication API
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

### 2. User Management API
```
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

### 3. Chat Sessions API
```
GET    /api/chat/sessions          # Kullanıcının tüm konuşmalarını getir
POST   /api/chat/sessions          # Yeni konuşma başlat
GET    /api/chat/sessions/:id      # Belirli konuşmayı getir
DELETE /api/chat/sessions/:id      # Konuşmayı sil
PUT    /api/chat/sessions/:id      # Konuşma başlığını güncelle
```

### 4. Messages API
```
POST /api/chat/sessions/:id/messages      # Mesaj gönder
GET  /api/chat/sessions/:id/messages      # Konuşmanın mesajlarını getir
```

### 5. AI/LLM API
```
POST /api/ai/chat        # AI yanıtı al
POST /api/ai/translate   # Çeviri yap
```

### 6. Speech API
```
POST /api/speech/text-to-speech    # Text'i sese çevir
POST /api/speech/speech-to-text    # Sesi text'e çevir
```

## Önerilen Tech Stack

### Backend
- **Framework**: Node.js + Express veya Next.js API Routes
- **Database**: PostgreSQL (user data, sessions) + Redis (cache)
- **Authentication**: JWT tokens
- **AI/LLM**: OpenAI GPT-4, Google Gemini, veya Azure OpenAI

### AI Entegrasyonu
```javascript
// Örnek OpenAI entegrasyonu
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function getChatResponse(message, context) {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `Sen bir Türkçe öğretmenisin. Adın ${context.teacher}. 
                  Öğrenci seviyesi: ${context.level}
                  Öğrenme amacı: ${context.goal}
                  Türkçe konuşarak öğretim yap, hatalarını düzelt, açıklama yap.`
      },
      {
        role: "user",
        content: message
      }
    ],
    temperature: 0.7,
    max_tokens: 500
  });
  
  return response.choices[0].message.content;
}
```

### Speech API Entegrasyonu
```javascript
// Text-to-Speech (Web Speech API veya Azure/Google Cloud)
async function textToSpeech(text, voice) {
  // Option 1: Web Speech API (Browser side - ücretsiz)
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'tr-TR';
  utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
  
  // Option 2: Azure Cognitive Services (Server side - ücretli ama daha kaliteli)
  const response = await fetch('https://REGION.tts.speech.microsoft.com/cognitiveservices/v1', {
    method: 'POST',
    headers: {
      'Ocp-Apim-Subscription-Key': process.env.AZURE_SPEECH_KEY,
      'Content-Type': 'application/ssml+xml',
      'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3'
    },
    body: `<speak version='1.0' xml:lang='tr-TR'>
            <voice name='tr-TR-EmelNeural'>${text}</voice>
          </speak>`
  });
  
  return response.blob();
}
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  turkish_level VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Chat Sessions Table
```sql
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) DEFAULT 'Yeni Konuşma',
  target_language VARCHAR(50),
  teacher VARCHAR(50),
  learning_goal VARCHAR(50),
  level VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Messages Table
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  sender VARCHAR(10) CHECK (sender IN ('user', 'ai')),
  translation TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Environment Variables Gerekli

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/konusturk
REDIS_URL=redis://localhost:6379

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# OpenAI
OPENAI_API_KEY=sk-...

# Azure Speech (opsiyonel, daha kaliteli TTS için)
AZURE_SPEECH_KEY=your-azure-key
AZURE_SPEECH_REGION=westeurope

# Google Translate API (çeviri için)
GOOGLE_TRANSLATE_API_KEY=your-google-key
```

## Frontend Değişiklikleri Gerekli

### 1. API Client Oluştur
```typescript
// src/lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('auth_token');
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(await response.text());
  }
  
  return response.json();
}
```

### 2. localStorage'ı API'ye Değiştir
```typescript
// Şu anki kod:
storage.loginUser(email, password);

// Değişecek:
const { user, token } = await apiRequest('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
localStorage.setItem('auth_token', token);
```

## Deployment

### Önerilen Platformlar
1. **Frontend**: Vercel, Netlify
2. **Backend**: Railway, Render, AWS, DigitalOcean
3. **Database**: Supabase, Neon, Railway PostgreSQL
4. **Redis**: Upstash, Redis Cloud

### Maliyet Tahmini (Aylık)
- **Database (Supabase Free/Pro)**: $0-25
- **OpenAI API (100K tokens/gün)**: ~$60-150
- **Azure Speech (opsiyonel)**: ~$10-50
- **Hosting (Vercel + Railway)**: $0-20
- **TOPLAM**: ~$70-245/ay (başlangıç için)

## Hızlı Başlangıç

1. **Şu an**: localStorage ile çalışıyor (offline, tek cihaz)
2. **Adım 1**: Backend API'yi kur (Express + PostgreSQL)
3. **Adım 2**: OpenAI entegrasyonu yap
4. **Adım 3**: Frontend'i API'ye bağla
5. **Adım 4**: Speech API ekle (Azure veya Web Speech)
6. **Adım 5**: Deploy et

## Test için Hazır Çözümler

**En hızlı yol**: Supabase + OpenAI
- Supabase: Auth, Database, Real-time hazır
- OpenAI: AI chat hazır
- Sadece API endpoint'leri yazman yeterli

Kodlama süresi: ~2-3 gün (temel özellikler için)
