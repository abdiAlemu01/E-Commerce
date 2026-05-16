# 🚀 Complete Setup Guide

This guide will walk you through setting up the entire e-commerce platform from scratch.

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installing Prerequisites](#installing-prerequisites)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Running the Application](#running-the-application)
7. [Creating Admin User](#creating-admin-user)
8. [Troubleshooting](#troubleshooting)

## System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Node.js**: v18.0.0 or higher
- **MongoDB**: v6.0 or higher
- **Redis**: v7.0 or higher
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: Minimum 2GB free space

## Installing Prerequisites

### 1. Install Node.js

#### Windows
1. Download from [nodejs.org](https://nodejs.org/)
2. Run the installer
3. Verify installation:
```bash
node --version
npm --version
```

#### macOS
```bash
# Using Homebrew
brew install node

# Verify
node --version
npm --version
```

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

### 2. Install MongoDB

#### Windows
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Choose "Complete" installation
4. Install MongoDB as a service
5. Verify installation:
```bash
mongod --version
```

#### macOS
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community@6.0

# Start MongoDB
brew services start mongodb-community@6.0

# Verify
mongosh --version
```

#### Linux (Ubuntu/Debian)
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Verify
mongosh --version
```

### 3. Install Redis

#### Windows
1. Download Redis from [redis.io](https://redis.io/download) or use WSL
2. Or use Docker:
```bash
docker run -d -p 6379:6379 redis:latest
```

#### macOS
```bash
# Using Homebrew
brew install redis

# Start Redis
brew services start redis

# Verify
redis-cli ping
# Should return: PONG
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install redis-server

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Verify
redis-cli ping
# Should return: PONG
```

## Database Setup

### 1. Create MongoDB Database

```bash
# Connect to MongoDB
mongosh

# Create database
use ecommerce

# Create admin user (optional but recommended)
db.createUser({
  user: "ecommerce_admin",
  pwd: "your_secure_password",
  roles: [{ role: "readWrite", db: "ecommerce" }]
})

# Exit
exit
```

### 2. Verify Redis

```bash
# Test Redis connection
redis-cli ping

# Should return: PONG
```

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your configuration
# Use your preferred text editor (nano, vim, notepad, etc.)
nano .env
```

### 4. Update .env File

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT (Generate secure random strings)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=noreply@ecommerce.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cache TTL (seconds)
CACHE_TTL=3600
```

### 5. Gmail App Password Setup (for email functionality)

1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → App Passwords
4. Generate a new app password for "Mail"
5. Copy the password to EMAIL_PASSWORD in .env

### 6. Start Backend Server
```bash
npm run dev
```

You should see:
```
✅ MongoDB Connected: localhost
✅ Redis Connected
🚀 E-Commerce Server Running
   Environment: development
   Port: 5000
   API Version: v1
```

## Frontend Setup

### 1. Open New Terminal and Navigate to Frontend
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
```bash
# Copy example env file
cp .env.example .env

# Edit .env file
nano .env
```

### 4. Update .env File
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

### 5. Start Frontend Development Server
```bash
npm run dev
```

You should see:
```
  VITE v5.0.11  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## Running the Application

### 1. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

### 2. Test the Setup

1. **Homepage**: Should load without errors
2. **Register**: Create a new customer account
3. **Login**: Log in with your credentials
4. **Products**: Browse products (will be empty initially)

## Creating Admin User

### Method 1: Using MongoDB Shell

```bash
# Connect to MongoDB
mongosh

# Switch to ecommerce database
use ecommerce

# Create admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@ecommerce.com",
  password: "$2a$10$YourHashedPasswordHere", // You need to hash the password
  role: "admin",
  isEmailVerified: true,
  isBlocked: false,
  language: "en",
  theme: "light",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Method 2: Register and Update Role

1. Register a new account through the UI
2. Update the role in MongoDB:

```bash
mongosh

use ecommerce

db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin", isEmailVerified: true } }
)
```

### Method 3: Create a Seed Script

Create `backend/src/scripts/createAdmin.js`:

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ecommerce.com',
      password: hashedPassword,
      role: 'admin',
      isEmailVerified: true,
    });
    
    console.log('✅ Admin user created:', admin.email);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createAdmin();
```

Run the script:
```bash
node src/scripts/createAdmin.js
```

## Troubleshooting

### MongoDB Connection Issues

**Error**: `MongoServerError: connect ECONNREFUSED`

**Solution**:
```bash
# Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list  # macOS

# Start MongoDB if not running
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### Redis Connection Issues

**Error**: `Redis connection failed`

**Solution**:
```bash
# Check if Redis is running
redis-cli ping

# Start Redis if not running
sudo systemctl start redis-server  # Linux
brew services start redis  # macOS
```

### Port Already in Use

**Error**: `Port 5000 is already in use`

**Solution**:
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or change PORT in .env
```

### Email Not Sending

**Issue**: Verification emails not being sent

**Solution**:
1. Verify EMAIL_USER and EMAIL_PASSWORD in .env
2. Enable "Less secure app access" or use App Password for Gmail
3. Check email service logs in backend console

### CORS Errors

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**:
1. Verify FRONTEND_URL in backend .env matches your frontend URL
2. Ensure backend CORS configuration includes your frontend URL
3. Clear browser cache and restart both servers

### Module Not Found Errors

**Error**: `Cannot find module 'xyz'`

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

**Error**: Build fails with various errors

**Solution**:
```bash
# Clear cache and rebuild
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Next Steps

1. **Add Sample Data**: Create categories, brands, and products
2. **Test Features**: Test all customer and admin features
3. **Configure Email**: Set up proper email service
4. **Customize**: Modify branding, colors, and content
5. **Deploy**: Follow deployment guide for production

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Redis Documentation](https://redis.io/documentation)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)

## Support

If you encounter issues not covered in this guide:
1. Check the main README.md
2. Review error logs in terminal
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

---

**Happy Coding! 🚀**
