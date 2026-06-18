# 🚀 Nepalaya Educational Foundation - Deployment Quick Guide

## 📋 Quick Setup (5 minutes)

### 1. MongoDB Atlas Setup
```bash
# Visit https://www.mongodb.com/cloud/atlas
# 1. Create account → Create project → Create cluster (Free tier M0)
# 2. Create database user (Security → Database Access)
# 3. Whitelist your IP (Security → Network Access)
# 4. Get connection string (Deployment → Connect → Drivers)
```

### 2. Copy Environment Files
```bash
# Server
cd server
cp .env.example .env
# Edit .env and add your MongoDB Atlas connection string

# Client
cd ../client
cp .env.example .env
# Edit .env and set VITE_API_BASE_URL
```

### 3. Test Locally
```bash
# Terminal 1: Start server
cd server
npm install
npm run dev

# Terminal 2: Start client
cd client
npm install
npm run dev

# Visit http://localhost:5173
```

### 4. Production Build
```bash
# Build server
cd server
npm run build

# Build client
cd client
npm run build
```

### 5. Deploy

#### Option A: Heroku (Easiest)
```bash
heroku login
heroku create nepalaya-prod
heroku config:set MONGODB_URI="mongodb+srv://..."
heroku config:set ADMIN_PASSWORD="YOUR_SECURE_PASSWORD"
git push heroku main
```

#### Option B: Docker
```bash
docker-compose up -d
# App runs on http://localhost:8000
```

#### Option C: AWS/Manual
See [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) for detailed instructions.

---

## 🔐 Environment Variables Reference

### Server (`.env`)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=nepalaya
PORT=8000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
ADMIN_PASSWORD=your-secure-password
```

### Client (`.env`)
```
VITE_API_BASE_URL=https://yourdomain.com/api
```

---

## ✅ Testing Production

```bash
# Test API
curl https://yourdomain.com/api/programs

# Test Admin Login
# Visit https://yourdomain.com/admin
# Password: (your ADMIN_PASSWORD)

# Test Admissions Form
# Visit https://yourdomain.com/admissions
# Submit a test application
```

---

## 📊 Admin Dashboard Features

**URL**: `https://yourdomain.com/admin`

- 📊 View admission statistics
- 📝 Manage applications (pending, accepted, rejected)
- 👨‍🏫 Manage faculty, programs, news
- 🖼️ Upload gallery images
- 🎓 Upload model/hero images

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "MONGODB_URI not set" | Add `MONGODB_URI` to `.env` file |
| CORS errors | Update `FRONTEND_URL` in server `.env` |
| Admin login fails | Verify `ADMIN_PASSWORD` and check `.env` |
| Can't connect to MongoDB | Check IP whitelist in MongoDB Atlas |

---

## 📚 Full Documentation

See [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md) for:
- Step-by-step MongoDB Atlas setup
- Detailed deployment to AWS/Heroku/Docker
- SSL certificate setup
- Monitoring and logs
- Backup strategy
- Security hardening

---

## 🎯 Pre-Launch Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user credentials set
- [ ] `.env` files configured (NOT committed to git)
- [ ] Local testing successful
- [ ] Production build created
- [ ] Deployment platform chosen (Heroku/AWS/Docker)
- [ ] Domain name configured
- [ ] SSL certificate setup
- [ ] Admin password changed from default
- [ ] IP whitelist configured for production
- [ ] Backups enabled
- [ ] Monitoring setup

---

## 🆘 Need Help?

1. Check [PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md)
2. Review error logs: `heroku logs --tail` or server logs
3. Verify MongoDB Atlas connection
4. Check browser console for API errors

---

**Last Updated**: June 2, 2026
