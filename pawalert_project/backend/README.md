# PawAlert Backend API

Kayıp evcil hayvanları takip etmek için backend API servisi.

## Kurulum

### 1. Bağımlılıkları Yükle
```bash
npm install
```

### 2. Environment Variables Ayarla

`.env.example` dosyasını kopyalayıp `.env` oluştur:
```bash
cp .env.example .env
```

`.env` dosyasını düzenle:
```env
PORT=5000
JWT_SECRET=your-very-strong-secret-key-min-32-characters
CORS_ORIGIN=https://yourfrontend.com
```

### 3. Servisi Başlat
```bash
npm start
```

Server http://localhost:5000 adresinde çalışacak.

## API Endpoints

### Authentication
- `POST /auth/register` - Yeni kullanıcı kaydı
- `POST /auth/login` - Kullanıcı girişi (JWT token döner)

### Reports (Kayıp İlanları)
- `GET /reports` - Tüm ilanları listele
- `GET /reports/:id` - İlan detayları + görülme kayıtları
- `POST /reports` - Yeni ilan oluştur (Auth gerekli)
- `PATCH /reports/:id/status` - İlan durumunu güncelle (Sadece sahip)
- `POST /reports/:id/seen` - Görülme kaydı ekle (Auth gerekli)

## Host'a Deployment (Render/Railway/Heroku)

### Render.com için:
1. GitHub'a push yap
2. Render'da "New Web Service" oluştur
3. Environment Variables ekle:
   - `JWT_SECRET`: Güçlü bir secret key
   - `CORS_ORIGIN`: Frontend domain'iniz
4. Build Command: `npm install`
5. Start Command: `npm start`

### Railway.app için:
1. GitHub'a push yap
2. Railway'de "New Project" > "Deploy from GitHub"
3. Variables sekmesinden environment variables ekle
4. Otomatik deploy olacak

### Önemli Notlar:
- SQLite dosya tabanlı database kullanıyor - production'da PostgreSQL düşünün
- JWT_SECRET mutlaka değiştirin!
- CORS_ORIGIN production domain'inize ayarlayın

## Database Schema

### users
- id, name, email (unique), password_hash, created_at

### reports
- id, user_id, pet_name, pet_type, color, description, last_seen_location, status, created_at

### seen_reports
- id, report_id, user_id, note, created_at
