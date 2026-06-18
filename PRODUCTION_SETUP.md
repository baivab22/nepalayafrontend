# Production Setup Guide - Nepalaya Educational Foundation

## 🚀 Pre-Deployment Checklist

### 1. MongoDB Atlas Setup

#### Step 1: Create MongoDB Atlas Account
- Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Sign up or log in
- Create a new project named "Nepalaya"

#### Step 2: Create a Cluster
1. Click "Create" in the Deployments section
2. Select the **M0 (Free Tier)** or **M10** for production
3. Choose your preferred region (recommend closest to your users or Asia Pacific)
4. Name the cluster: `nepalaya-prod`
5. Create cluster (may take 3-5 minutes)

#### Step 3: Create Database User
1. Go to Security → Database Access
2. Click "Add Database User"
3. Create a user:
   - **Username**: `nepalaya_admin` (or your preference)
   - **Password**: Generate a strong password (copy it!)
   - **Database User Privileges**: `Read and write to any database`
4. Click "Add User"

#### Step 4: Whitelist IP Addresses
1. Go to Security → Network Access
2. Click "Add IP Address"
3. Add:
   - Your development machine IP (for testing)
   - Your production server IP
   - For development/testing: `0.0.0.0/0` (allow all - NOT recommended for production)
4. Click "Confirm"

#### Step 5: Get Connection String
1. Go to Deployments → Clusters
2. Click "Connect" on your cluster
3. Choose "Drivers" → "Node.js"
4. Copy the connection string: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`

### 2. Environment Configuration

#### Server Setup (`.env`)

```bash
# Create server/.env
MONGODB_URI=mongodb+srv://nepalaya_admin:YOUR_PASSWORD@nepalaya-prod.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=nepalaya
PORT=8000
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
MAX_UPLOAD_SIZE=50
UPLOAD_DIR=./uploads
ADMIN_PASSWORD=YOUR_SECURE_PASSWORD_HERE
```

**Important:** 
- Replace `YOUR_PASSWORD` with the password from Step 3
- Replace `nepalaya-prod` with your actual cluster name
- Change `ADMIN_PASSWORD` to a strong, unique password
- Update `FRONTEND_URL` to your production domain

#### Client Setup (`.env`)

```bash
# Create client/.env
VITE_API_BASE_URL=https://api.yourdomain.com
```

Or if using same domain:
```bash
VITE_API_BASE_URL=https://yourdomain.com/api
```

### 3. Build for Production

#### Server Build
```bash
cd server
npm run build
```

#### Client Build
```bash
cd client
npm run build
```

### 4. Deployment Options

#### Option A: Deploy to Heroku (Easiest)

1. **Install Heroku CLI**: https://devcenter.heroku.com/articles/heroku-cli
2. **Create Heroku app**:
   ```bash
   heroku create nepalaya-prod
   ```

3. **Set environment variables**:
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://nepalaya_admin:PASSWORD@nepalaya-prod.mongodb.net/?retryWrites=true&w=majority"
   heroku config:set MONGODB_DB_NAME="nepalaya"
   heroku config:set NODE_ENV="production"
   heroku config:set FRONTEND_URL="https://nepalaya-prod.herokuapp.com"
   heroku config:set ADMIN_PASSWORD="YOUR_SECURE_PASSWORD"
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

#### Option B: Deploy to AWS EC2

1. **Create EC2 Instance**:
   - Ubuntu 22.04 LTS
   - t2.micro (free tier) or t2.small for production
   - Configure security groups:
     - Port 80 (HTTP)
     - Port 443 (HTTPS)
     - Port 22 (SSH)

2. **SSH into instance**:
   ```bash
   ssh -i your-key.pem ubuntu@your-instance-ip
   ```

3. **Install dependencies**:
   ```bash
   sudo apt update
   sudo apt install -y nodejs npm git nginx
   ```

4. **Clone and build**:
   ```bash
   git clone YOUR_REPO_URL
   cd nepalayafrontend
   
   # Server
   cd server
   npm install
   npm run build
   
   # Client
   cd ../client
   npm install
   npm run build
   ```

5. **Configure Nginx as reverse proxy**:
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:8000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Create `.env` file**:
   ```bash
   cd server
   nano .env
   # Add your production variables
   ```

7. **Start server with PM2** (process manager):
   ```bash
   npm install -g pm2
   cd server
   pm2 start "npm run start" --name "nepalaya-api"
   pm2 save
   pm2 startup
   ```

#### Option C: Deploy to Docker + Cloud Run / Railway

Create `Dockerfile` in server root:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 8000
CMD ["node", "dist/index.cjs"]
```

Then deploy using your preferred cloud provider.

### 5. Post-Deployment Testing

#### 1. Test API Health
```bash
curl https://your-domain.com/api/health
```

#### 2. Test Programs Endpoint
```bash
curl https://your-domain.com/api/programs
```

#### 3. Test Admissions Submission
```bash
curl -X POST https://your-domain.com/api/admissions \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "9800000000",
    "dateOfBirth": "2000-01-01",
    "gender": "male",
    "address": "Test Address",
    "district": "Kathmandu",
    "program": "B.E. Computer Engineering",
    "level": "bachelor",
    "previousSchool": "Test School"
  }'
```

#### 4. Check Admin Portal
Visit `https://your-domain.com/admin` and log in with:
- Password: (the `ADMIN_PASSWORD` you set)

### 6. SSL Certificate Setup

#### Using Let's Encrypt (Free)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 7. Monitoring & Logs

#### Heroku
```bash
heroku logs --tail
```

#### EC2 with PM2
```bash
pm2 logs nepalaya-api
pm2 monit  # Real-time monitoring
```

### 8. Backup Strategy

1. **Enable MongoDB Atlas Backups**:
   - Go to Backup in MongoDB Atlas
   - Enable "Continuous Backup (Restore Window: 35 days)"

2. **Scheduled Backups** (Optional):
   ```bash
   # MongoDB Atlas handles this automatically with Continuous Backup
   ```

3. **Database Snapshots**:
   - Atlas automatically creates hourly snapshots
   - You can manually trigger snapshots before deployments

### 9. Performance Optimization

1. **Enable CDN** (CloudFlare, CloudFront):
   - Serve static assets globally
   - Reduced latency for users

2. **Database Indexing**:
   ```javascript
   // MongoDB indexes are already configured in schema
   // Monitor query performance in Atlas
   ```

3. **API Rate Limiting** (Optional):
   - Add `express-rate-limit` package
   - Protect admin endpoints from brute force

### 10. Security Hardening

✅ **Already Done**:
- CORS protection (environment-aware)
- Input validation with Zod
- Secure password hashing (if implemented)

⚠️ **To Do**:
- [ ] Change `ADMIN_PASSWORD` from default
- [ ] Enable 2FA for MongoDB Atlas account
- [ ] Set up IP whitelist for production only
- [ ] Use HTTPS everywhere
- [ ] Add rate limiting for login attempts
- [ ] Implement audit logging for admin actions
- [ ] Regular security audits

### 11. Troubleshooting

#### "MONGODB_URI must be set"
- Check `.env` file exists in server root
- Verify `MONGODB_URI` is correctly formatted
- Test connection: `mongosh "mongodb+srv://..."`

#### CORS errors
- Verify `FRONTEND_URL` matches your domain
- Check browser console for the blocked origin
- Update `FRONTEND_URL` in server `.env`

#### Connection to MongoDB fails
- Check IP whitelist in MongoDB Atlas
- Verify database user password
- Ensure cluster is running (not paused)
- Test from terminal: `mongosh "your-connection-string"`

#### Admin login fails
- Verify `ADMIN_PASSWORD` in `.env`
- Check sessionStorage in browser DevTools
- Clear browser cache and retry

---

## Quick Start Reference

### Local Development
```bash
# Terminal 1: Start MongoDB (if local)
mongod

# Terminal 2: Start server
cd server
npm install
npm run dev

# Terminal 3: Start client
cd client
npm install
npm run dev
```

### Production Deployment (Heroku)
```bash
heroku login
heroku create nepalaya-prod
heroku config:set MONGODB_URI="..."
git push heroku main
```

### Check Production Logs
```bash
heroku logs --tail
```

---

## Support & Resources

- **MongoDB Atlas Docs**: https://docs.mongodb.com/atlas/
- **Express.js Docs**: https://expressjs.com/
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev

---

**Last Updated**: June 2, 2026
