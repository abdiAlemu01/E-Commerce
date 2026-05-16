# 🚀 Deployment Guide

This guide covers deploying the e-commerce platform to production environments.

## Table of Contents
1. [Pre-deployment Checklist](#pre-deployment-checklist)
2. [Backend Deployment](#backend-deployment)
3. [Frontend Deployment](#frontend-deployment)
4. [Database Setup](#database-setup)
5. [Environment Configuration](#environment-configuration)
6. [SSL/HTTPS Setup](#ssl-https-setup)
7. [Monitoring & Logging](#monitoring--logging)

## Pre-deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database backups configured
- [ ] SSL certificates obtained
- [ ] Domain names configured
- [ ] Email service configured
- [ ] Redis configured
- [ ] Security headers enabled
- [ ] Rate limiting configured
- [ ] Error logging setup

## Backend Deployment

### Option 1: Heroku

#### 1. Install Heroku CLI
```bash
npm install -g heroku
heroku login
```

#### 2. Create Heroku App
```bash
cd backend
heroku create your-app-name
```

#### 3. Add MongoDB Atlas
```bash
heroku addons:create mongolab:sandbox
```

#### 4. Add Redis
```bash
heroku addons:create heroku-redis:hobby-dev
```

#### 5. Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-secret
heroku config:set JWT_REFRESH_SECRET=your-refresh-secret
heroku config:set FRONTEND_URL=https://your-frontend-domain.com
heroku config:set EMAIL_HOST=smtp.gmail.com
heroku config:set EMAIL_PORT=587
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
```

#### 6. Deploy
```bash
git push heroku main
```

### Option 2: DigitalOcean/AWS/VPS

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

#### 2. Clone Repository
```bash
cd /var/www
git clone <your-repo-url>
cd ecommerce-platform/backend
npm install --production
```

#### 3. Configure PM2
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'ecommerce-api',
    script: 'src/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### 4. Configure Nginx
Create `/etc/nginx/sites-available/api`:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Option 3: Docker

#### 1. Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
```

#### 2. Create docker-compose.yml
```yaml
version: '3.8'

services:
  api:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/ecommerce
      - REDIS_HOST=redis
    depends_on:
      - mongo
      - redis

  mongo:
    image: mongo:6
    volumes:
      - mongo-data:/data/db

  redis:
    image: redis:7-alpine
    volumes:
      - redis-data:/data

volumes:
  mongo-data:
  redis-data:
```

#### 3. Deploy
```bash
docker-compose up -d
```

## Frontend Deployment

### Option 1: Vercel (Recommended)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Deploy
```bash
cd frontend
vercel
```

#### 3. Configure Environment Variables
In Vercel dashboard, add:
- `VITE_API_URL`: Your backend API URL
- `VITE_SOCKET_URL`: Your backend Socket.IO URL

### Option 2: Netlify

#### 1. Build
```bash
cd frontend
npm run build
```

#### 2. Deploy via Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### 3. Configure
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: Nginx (VPS)

#### 1. Build
```bash
cd frontend
npm run build
```

#### 2. Copy to Server
```bash
scp -r dist/* user@server:/var/www/html/
```

#### 3. Configure Nginx
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

## Database Setup

### MongoDB Atlas (Recommended)

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Add database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get connection string
6. Update `MONGODB_URI` in environment variables

### Self-hosted MongoDB

```bash
# Install MongoDB
sudo apt install mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Secure MongoDB
mongo
use admin
db.createUser({
  user: "admin",
  pwd: "secure_password",
  roles: ["root"]
})
```

## Environment Configuration

### Production Environment Variables

#### Backend
```env
NODE_ENV=production
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecommerce

# Redis (Use Redis Cloud or self-hosted)
REDIS_HOST=redis-xxxxx.cloud.redislabs.com
REDIS_PORT=12345
REDIS_PASSWORD=your-redis-password

# JWT (Use strong random strings)
JWT_SECRET=generate-with-openssl-rand-base64-32
JWT_REFRESH_SECRET=generate-with-openssl-rand-base64-32
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Email
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_FROM=noreply@yourdomain.com

# Frontend
FRONTEND_URL=https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cache
CACHE_TTL=3600
```

#### Frontend
```env
VITE_API_URL=https://api.yourdomain.com/api/v1
VITE_SOCKET_URL=https://api.yourdomain.com
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Nginx SSL Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... rest of configuration
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

## Monitoring & Logging

### PM2 Monitoring
```bash
# View logs
pm2 logs

# Monitor
pm2 monit

# Web dashboard
pm2 plus
```

### Error Tracking

#### Sentry Integration
```bash
npm install @sentry/node
```

Add to `server.js`:
```javascript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Log Management

#### Winston Logger
```bash
npm install winston
```

Create `src/config/logger.js`:
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

## Performance Optimization

### Backend
- Enable compression
- Use Redis caching
- Optimize database queries
- Use CDN for static assets
- Enable HTTP/2

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Minification
- Gzip compression
- CDN for assets

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] Rate limiting enabled
- [ ] CORS configured properly
- [ ] Security headers set (Helmet)
- [ ] Input validation
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF protection
- [ ] Regular security updates
- [ ] Backup strategy in place

## Backup Strategy

### Database Backup
```bash
# MongoDB backup
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/ecommerce" --out=/backup/$(date +%Y%m%d)

# Automated daily backup (crontab)
0 2 * * * /usr/bin/mongodump --uri="mongodb+srv://..." --out=/backup/$(date +\%Y\%m\%d)
```

### File Backup
```bash
# Backup uploads directory
tar -czf uploads-backup-$(date +%Y%m%d).tar.gz /var/www/ecommerce/backend/uploads
```

## Rollback Strategy

### PM2 Rollback
```bash
# List deployments
pm2 deploy ecosystem.config.js production list

# Rollback
pm2 deploy ecosystem.config.js production revert 1
```

### Git Rollback
```bash
git revert HEAD
git push origin main
```

## Post-Deployment

1. Test all critical features
2. Monitor error logs
3. Check performance metrics
4. Verify email delivery
5. Test payment processing
6. Monitor server resources
7. Set up alerts

## Support & Maintenance

- Regular security updates
- Database optimization
- Performance monitoring
- User feedback collection
- Bug fixes and improvements

---

**Deployment Complete! 🎉**

For issues, check logs and monitoring dashboards.
