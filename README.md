# PawAlert Backend

Kayıp evcil hayvan takip sistemi backend API.

## Deployment on Render

1. Build Command: `npm install`
2. Start Command: `npm start`
3. Environment Variables:
   - `JWT_SECRET`: Your secret key
   - `CORS_ORIGIN`: `*` or your frontend URL

## API Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /reports` - List all reports
- `POST /reports` - Create report (auth required)
- `GET /reports/:id` - Get report details
- `PATCH /reports/:id/status` - Update status (owner only)
- `POST /reports/:id/seen` - Add sighting (auth required)

## Local Development

```bash
npm install
npm start
```

Server runs on http://localhost:5000
