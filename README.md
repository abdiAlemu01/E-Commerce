# 🛍️ Modern E-Commerce Platform

A production-ready, full-stack e-commerce web application built with the MERN stack, featuring multilingual support, real-time communication, and enterprise-level architecture.

## ✨ Features

### 🎯 Core Features
- **Multi-language Support**: English, Afaan Oromo, and Amharic
- **Theme System**: Light/Dark mode with persistent settings
- **Real-time Communication**: Socket.IO powered messaging between customers and admins
- **Role-based Access Control**: Separate dashboards for customers and admins
- **Advanced State Management**: Zustand for global state, TanStack Query for server state
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Performance Optimized**: Redis caching, lazy loading, code splitting
- **Security First**: JWT authentication, rate limiting, input validation, XSS protection

### 👤 Customer Features
- User registration and authentication
- Email verification
- Password reset functionality
- Product browsing with search, filter, and sort
- Shopping cart management
- Wishlist functionality
- Order placement and tracking
- Product reviews and ratings
- Real-time chat with support
- Profile management
- Multiple shipping addresses
- Order history and invoices

### 👨‍💼 Admin Features
- Comprehensive dashboard with analytics
- Product management (CRUD operations)
- Category and brand management
- Order management and status updates
- Customer management
- Coupon/discount management
- Real-time customer support chat
- User blocking/unblocking
- Reports and logs
- Inventory management

## 🏗️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis
- **Authentication**: JWT (Access & Refresh tokens)
- **Real-time**: Socket.IO
- **Security**: Helmet, bcryptjs, express-rate-limit, express-mongo-sanitize
- **Validation**: express-validator, Joi
- **Email**: Nodemailer
- **File Upload**: Multer, Sharp (image processing)

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **State Management**: 
  - Zustand (global state)
  - TanStack Query (server state & caching)
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Internationalization**: react-i18next
- **Real-time**: Socket.IO Client
- **Notifications**: react-hot-toast
- **Icons**: react-icons

## 📁 Project Structure

```
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files (DB, Redis, Email)
│   │   ├── controllers/     # Route controllers
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Custom middlewares
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   ├── validators/      # Input validation
│   │   ├── repositories/    # Data access layer
│   │   ├── socket/          # Socket.IO handlers
│   │   └── server.js        # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── features/        # Feature-based modules
│   │   ├── layouts/         # Layout components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API services
│   │   ├── store/           # Zustand stores
│   │   ├── utils/           # Utility functions
│   │   ├── i18n/            # Internationalization
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Redis (v7 or higher)
- npm or yarn

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd ecommerce-platform
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
# - MongoDB connection string
# - Redis configuration
# - JWT secrets
# - Email credentials
# - Frontend URL

# Start development server
npm run dev
```

#### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with backend URL
# VITE_API_URL=http://localhost:5000/api/v1
# VITE_SOCKET_URL=http://localhost:5000

# Start development server
npm run dev
```

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@ecommerce.com

# Frontend
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Cache
CACHE_TTL=3600
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

## 🗄️ Database Collections

- **Users**: User accounts (customers & admins)
- **Products**: Product catalog
- **Categories**: Product categories
- **Brands**: Product brands
- **Orders**: Customer orders
- **Reviews**: Product reviews
- **Coupons**: Discount coupons
- **Cart**: Shopping carts
- **Conversations**: Chat conversations
- **Messages**: Chat messages
- **Notifications**: User notifications

## 🔐 Authentication Flow

1. User registers → Email verification sent
2. User verifies email → Account activated
3. User logs in → Access token (15min) + Refresh token (7 days)
4. Access token expires → Auto-refresh using refresh token
5. Refresh token expires → User must log in again

## 🌐 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/profile` - Update profile
- `PUT /api/v1/auth/update-password` - Change password
- `GET /api/v1/auth/verify-email/:token` - Verify email
- `POST /api/v1/auth/forgot-password` - Request password reset
- `PUT /api/v1/auth/reset-password/:token` - Reset password
- `POST /api/v1/auth/refresh-token` - Refresh access token

### Products
- `GET /api/v1/products` - Get all products (with pagination, search, filter)
- `GET /api/v1/products/:id` - Get single product
- `GET /api/v1/products/slug/:slug` - Get product by slug
- `GET /api/v1/products/featured` - Get featured products
- `GET /api/v1/products/:id/related` - Get related products
- `POST /api/v1/products` - Create product (Admin)
- `PUT /api/v1/products/:id` - Update product (Admin)
- `DELETE /api/v1/products/:id` - Delete product (Admin)

## 🎨 Frontend Architecture

### State Management Strategy

#### Zustand Stores (Global State)
- **authStore**: Authentication state, user data, tokens
- **cartStore**: Shopping cart items and operations
- **wishlistStore**: Wishlist items
- **themeStore**: Theme preferences (light/dark)
- **languageStore**: Language preferences

#### TanStack Query (Server State)
- Product data with caching
- Order history
- User profile
- Categories and brands
- Real-time data synchronization
- Optimistic updates
- Background refetching

### Component Structure
- **Layouts**: MainLayout, DashboardLayout
- **Pages**: Feature-specific page components
- **Components**: Reusable UI components
- **Features**: Feature-based modules with co-located logic

## 🔒 Security Features

- **Authentication**: JWT with refresh token rotation
- **Password Security**: bcrypt hashing with salt rounds
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Server-side validation with express-validator
- **XSS Protection**: Helmet middleware
- **CSRF Protection**: SameSite cookies
- **MongoDB Injection**: express-mongo-sanitize
- **Secure Headers**: Helmet security headers
- **HTTPS**: Production deployment with SSL
- **Environment Variables**: Sensitive data protection

## ⚡ Performance Optimizations

### Backend
- Redis caching for frequently accessed data
- Database indexing for faster queries
- Pagination for large datasets
- Query optimization
- Compression middleware
- Async processing

### Frontend
- Code splitting with React.lazy
- Route-based lazy loading
- Image optimization
- Debounced search
- Virtualized lists for large datasets
- Memoization with React.memo
- TanStack Query caching
- Service Worker for PWA

## 🌍 Internationalization

The application supports three languages:
- **English (en)**: Default language
- **Afaan Oromo (om)**: Oromo language
- **Amharic (am)**: Amharic language

Translation files are located in `frontend/src/i18n/locales/`

## 💬 Real-time Features

### Socket.IO Events

#### Client → Server
- `message:send` - Send a message
- `conversation:join` - Join a conversation
- `conversation:leave` - Leave a conversation
- `typing:start` - Start typing indicator
- `typing:stop` - Stop typing indicator

#### Server → Client
- `message:new` - New message received
- `message:notification` - Message notification
- `typing:start` - User started typing
- `typing:stop` - User stopped typing
- `user:online` - User came online
- `user:offline` - User went offline

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly UI elements
- Optimized for all screen sizes

## 🧪 Testing (To be implemented)

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set NODE_ENV=production
2. Configure production MongoDB and Redis
3. Set secure JWT secrets
4. Configure email service
5. Deploy to hosting service (Heroku, AWS, DigitalOcean, etc.)

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy to hosting service (Vercel, Netlify, AWS S3, etc.)
3. Configure environment variables
4. Set up CDN for static assets

## 📝 License

MIT License

## 👥 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📧 Support

For support, email support@eshop.com or join our Slack channel.

## 🙏 Acknowledgments

- React team for the amazing library
- Express.js community
- MongoDB team
- All open-source contributors

---

**Built with ❤️ using modern web technologies**
