# ⚡ Quick Start Guide

Get the e-commerce platform running in 5 minutes!

## Prerequisites

Make sure you have installed:
- Node.js (v18+)
- MongoDB (v6+)
- Redis (v7+)

## 🚀 Quick Setup

### 1. Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd ecommerce-platform

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

#### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your settings:
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
REDIS_HOST=localhost
JWT_SECRET=your-secret-key-here
JWT_REFRESH_SECRET=your-refresh-secret-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000
```

#### Frontend (.env)
```bash
cd ../frontend
cp .env.example .env
```

The default values should work:
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

### 3. Start Services

#### Terminal 1 - MongoDB
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

#### Terminal 2 - Redis
```bash
# Windows (WSL or Docker)
redis-server

# macOS
brew services start redis

# Linux
sudo systemctl start redis
```

#### Terminal 3 - Backend
```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB Connected
✅ Redis Connected
🚀 E-Commerce Server Running on port 5000
```

#### Terminal 4 - Frontend
```bash
cd frontend
npm run dev
```

You should see:
```
➜  Local:   http://localhost:3000/
```

### 4. Access the Application

Open your browser and go to:
```
http://localhost:3000
```

## 🎯 First Steps

### Create a Customer Account
1. Click "Register" in the header
2. Fill in your details
3. Check your email for verification (if configured)
4. Login with your credentials

### Create an Admin Account

**Option 1: Via MongoDB Shell**
```bash
mongosh

use ecommerce

db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin", isEmailVerified: true } }
)
```

**Option 2: Create Admin Script**

Create `backend/createAdmin.js`:
```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const User = mongoose.model('User', new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
    isEmailVerified: Boolean,
  }));

  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  await User.create({
    name: 'Admin User',
    email: 'admin@ecommerce.com',
    password: hashedPassword,
    role: 'admin',
    isEmailVerified: true,
  });
  
  console.log('✅ Admin created: admin@ecommerce.com / admin123');
  process.exit(0);
};

createAdmin();
```

Run it:
```bash
node createAdmin.js
```

### Test the Platform

1. **Browse Products** - Go to Products page
2. **Add to Cart** - Click on a product and add to cart
3. **View Cart** - Check your cart
4. **Login as Admin** - Access admin dashboard
5. **Add Products** - Create your first product (Admin)
6. **Create Categories** - Organize products (Admin)

## 🔧 Common Issues

### MongoDB Connection Error
```bash
# Check if MongoDB is running
mongosh

# If not, start it
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### Redis Connection Error
```bash
# Check if Redis is running
redis-cli ping

# Should return: PONG

# If not, start it
sudo systemctl start redis  # Linux
brew services start redis  # macOS
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or change PORT in .env
```

### Email Not Sending
- Use Gmail with App Password (not regular password)
- Enable 2FA in Google Account
- Generate App Password in Security settings
- Use the App Password in EMAIL_PASSWORD

## 📚 Next Steps

1. **Read the Documentation**
   - [README.md](README.md) - Full documentation
   - [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment

2. **Explore Features**
   - Customer dashboard
   - Admin dashboard
   - Product management
   - Order system
   - Real-time messaging

3. **Customize**
   - Update branding
   - Modify colors (Tailwind config)
   - Add your products
   - Configure payment gateway

4. **Deploy**
   - Follow [DEPLOYMENT.md](DEPLOYMENT.md)
   - Set up production database
   - Configure domain and SSL
   - Deploy to cloud

## 🎨 Default Credentials

After creating admin account:
- **Admin**: admin@ecommerce.com / admin123
- **Customer**: (register your own)

## 🌍 Language Switching

The app supports 3 languages:
- English (en)
- Afaan Oromo (om)
- አማርኛ (am)

Switch language using the dropdown in the header.

## 🎨 Theme Switching

Toggle between light and dark mode using the theme button in the header.

## 📱 Test on Mobile

The app is fully responsive. Test on:
- Mobile devices
- Tablets
- Desktop

## 🆘 Need Help?

- Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions
- Review error messages in terminal
- Check browser console for frontend errors
- Verify all environment variables are set

## ✅ Checklist

- [ ] Node.js installed
- [ ] MongoDB running
- [ ] Redis running
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Environment variables configured
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Application accessible at localhost:3000
- [ ] Admin account created

---

**You're all set! Start building your e-commerce empire! 🚀**
