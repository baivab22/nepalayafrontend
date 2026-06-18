# 🚀 NEPALAYA EDUCATIONAL FOUNDATION - DEPLOYMENT GUIDE

This application is fully production-ready with MongoDB Atlas integration, Docker containerization, and CI/CD pipeline support.

## ⚡ Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 20+
- MongoDB Atlas account (free tier available)
- Heroku account (optional, for easy deployment)

### 2. Local Development
```bash
# Clone or open this project

# Install dependencies
cd client && npm install && cd ..
cd server && npm install && cd ..

# Create .env.local for server
cd server
cat > .env.local << EOF
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=nepalaya
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
ADMIN_PASSWORD=admin@nepalaya2025
EOF

# Create .env.local for client
cd ../client
cat > .env.local << EOF
VITE_API_BASE_URL=http://localhost:8000
EOF

# Start development servers
cd ../server && npm run dev
# In another terminal:
cd client && npm run dev

# Visit http://localhost:5173
```

### 3. Production Deployment

**Step 1: Set up MongoDB Atlas**
1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account and M0 cluster
3. Create database user (Security → Database Access)
4. Whitelist your IP (Network Access)
5. Copy connection string

**Step 2: Deploy (Choose one)**

**A. Heroku (Easiest)**
```bash
npm install -g heroku
heroku login
heroku create nepalaya-prod
heroku config:set MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/nepalaya"
heroku config:set ADMIN_PASSWORD="YOUR_SECURE_PASSWORD"
heroku config:set FRONTEND_URL="https://nepalaya-prod.herokuapp.com"
git push heroku main
```

**B. Docker**
```bash
docker-compose up -d
# App runs on http://localhost:8000
```

**C. Manual / AWS EC2**
See `PRODUCTION_SETUP.md` for detailed instructions

## 📚 Documentation

- **[PRODUCTION_READY_CHECKLIST.md](./PRODUCTION_READY_CHECKLIST.md)** - Complete status & verification
- **[PRODUCTION_SETUP.md](./PRODUCTION_SETUP.md)** - Detailed setup instructions
- **[DEPLOYMENT_QUICK_START.md](./DEPLOYMENT_QUICK_START.md)** - Quick reference

## 🔐 Security

⚠️ **IMPORTANT**: 
- Never commit `.env` files to git (already in `.gitignore`)
- Change `ADMIN_PASSWORD` before production
- Whitelist only your production IP in MongoDB Atlas
- Enable HTTPS/SSL certificates

## 📊 Admin Portal

**URL**: `https://yourdomain.com/admin`  
**Password**: Set via `ADMIN_PASSWORD` environment variable

## ✅ Verification

After deployment:
```bash
# Test API health
curl https://yourdomain.com/api/programs

# Test admin login
# Visit https://yourdomain.com/admin

# Check logs
heroku logs --tail  # if using Heroku
```

## 🎯 Features

✅ Full-featured admin dashboard  
✅ 3D animated faculty slider  
✅ Responsive design (mobile, tablet, desktop)  
✅ Production-grade security  
✅ MongoDB Atlas integration  
✅ Docker containerization  
✅ CI/CD pipeline (GitHub Actions)  
✅ Multi-step admissions form  
✅ Image gallery management  
✅ News management  
✅ Faculty profiles  

## 📞 Support

- Check documentation files above
- Review error logs on production server
- Test locally first with `npm run dev`

---

**Status**: 🟢 PRODUCTION READY | **Last Updated**: June 2, 2026
