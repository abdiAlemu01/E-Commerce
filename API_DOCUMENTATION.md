# 📡 API Documentation

Complete API reference for the E-Commerce Platform.

## Base URL

```
Development: http://localhost:5000/api/v1
Production: https://api.yourdomain.com/api/v1
```

## Authentication

Most endpoints require authentication using JWT tokens.

### Headers
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Token Refresh
Access tokens expire after 15 minutes. Use the refresh token to get a new access token.

---

## 🔐 Authentication Endpoints

### Register User
Create a new user account.

```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "language": "en"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "isEmailVerified": false
  }
}
```

---

### Login
Authenticate user and receive tokens.

```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "avatar": "",
    "isEmailVerified": true,
    "language": "en",
    "theme": "light"
  }
}
```

---

### Logout
Invalidate refresh token.

```http
POST /auth/logout
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### Get Current User
Get authenticated user's profile.

```http
GET /auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "customer",
    "phone": "+1234567890",
    "avatar": "",
    "isEmailVerified": true,
    "language": "en",
    "theme": "light",
    "addresses": [],
    "wishlist": []
  }
}
```

---

### Update Profile
Update user profile information.

```http
PUT /auth/profile
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+1234567890",
  "language": "om",
  "theme": "dark"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Updated",
    "email": "john@example.com",
    "phone": "+1234567890",
    "language": "om",
    "theme": "dark"
  }
}
```

---

### Update Password
Change user password.

```http
PUT /auth/update-password
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password updated successfully",
  "token": "new_access_token",
  "refreshToken": "new_refresh_token"
}
```

---

### Verify Email
Verify user email with token.

```http
GET /auth/verify-email/:token
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

---

### Forgot Password
Request password reset email.

```http
POST /auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### Reset Password
Reset password with token.

```http
PUT /auth/reset-password/:token
```

**Request Body:**
```json
{
  "password": "newpassword123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset successful",
  "token": "new_access_token",
  "refreshToken": "new_refresh_token"
}
```

---

### Refresh Token
Get new access token using refresh token.

```http
POST /auth/refresh-token
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "token": "new_access_token",
  "refreshToken": "new_refresh_token"
}
```

---

## 📦 Product Endpoints

### Get All Products
Retrieve products with filtering, sorting, and pagination.

```http
GET /products
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `keyword` (string): Search keyword
- `category` (string): Filter by category ID
- `brand` (string): Filter by brand ID
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `rating` (number): Minimum rating
- `sort` (string): Sort field (e.g., "price", "-createdAt")

**Example:**
```http
GET /products?page=1&limit=12&keyword=laptop&minPrice=500&sort=-rating
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Gaming Laptop",
      "slug": "gaming-laptop",
      "description": "High-performance gaming laptop",
      "price": 1299.99,
      "comparePrice": 1499.99,
      "category": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Electronics"
      },
      "brand": {
        "_id": "507f1f77bcf86cd799439013",
        "name": "TechBrand"
      },
      "images": [
        {
          "url": "https://example.com/image.jpg",
          "alt": "Gaming Laptop",
          "isPrimary": true
        }
      ],
      "stock": 50,
      "rating": 4.5,
      "numReviews": 120,
      "isActive": true,
      "isFeatured": true,
      "discountPercentage": 13,
      "inStock": true
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 12,
    "totalPages": 13,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

---

### Get Single Product
Get product details by ID.

```http
GET /products/:id
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Gaming Laptop",
    "slug": "gaming-laptop",
    "description": "High-performance gaming laptop with RTX graphics",
    "price": 1299.99,
    "comparePrice": 1499.99,
    "category": { /* category object */ },
    "brand": { /* brand object */ },
    "images": [ /* images array */ ],
    "stock": 50,
    "specifications": [
      { "key": "Processor", "value": "Intel i7" },
      { "key": "RAM", "value": "16GB" }
    ],
    "rating": 4.5,
    "numReviews": 120,
    "reviews": [ /* populated reviews */ ]
  }
}
```

---

### Get Product by Slug
Get product details by slug.

```http
GET /products/slug/:slug
```

**Response:** Same as Get Single Product

---

### Get Featured Products
Get featured products.

```http
GET /products/featured
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [ /* array of featured products */ ]
}
```

---

### Get Related Products
Get products related to a specific product.

```http
GET /products/:id/related
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [ /* array of related products */ ]
}
```

---

### Create Product (Admin)
Create a new product.

```http
POST /products
```

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description",
  "price": 99.99,
  "comparePrice": 129.99,
  "category": "507f1f77bcf86cd799439012",
  "brand": "507f1f77bcf86cd799439013",
  "stock": 100,
  "images": [
    {
      "url": "https://example.com/image.jpg",
      "alt": "Product image",
      "isPrimary": true
    }
  ],
  "specifications": [
    { "key": "Color", "value": "Black" }
  ],
  "tags": ["electronics", "gadgets"],
  "isFeatured": true
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": { /* created product */ }
}
```

---

### Update Product (Admin)
Update existing product.

```http
PUT /products/:id
```

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:** Same as Create Product

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product updated successfully",
  "data": { /* updated product */ }
}
```

---

### Delete Product (Admin)
Delete a product.

```http
DELETE /products/:id
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

---

## 📂 Category Endpoints

### Get All Categories
Get all active categories.

```http
GET /categories
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Electronics",
      "slug": "electronics",
      "description": "Electronic devices and gadgets",
      "image": "https://example.com/category.jpg",
      "isActive": true,
      "order": 1,
      "subcategories": [ /* child categories */ ]
    }
  ]
}
```

---

### Get Single Category
Get category by ID.

```http
GET /categories/:id
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": { /* category object with subcategories */ }
}
```

---

### Create Category (Admin)
Create new category.

```http
POST /categories
```

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "New Category",
  "description": "Category description",
  "parent": null,
  "image": "https://example.com/image.jpg",
  "order": 1,
  "translations": {
    "om": {
      "name": "Ramaddii Haaraa",
      "description": "Ibsa ramaddii"
    },
    "am": {
      "name": "አዲስ ምድብ",
      "description": "የምድብ መግለጫ"
    }
  }
}
```

**Response:** `201 Created`

---

## 🛒 Order Endpoints

### Create Order
Place a new order.

```http
POST /orders
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "items": [
    {
      "product": "507f1f77bcf86cd799439011",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "+1234567890",
    "addressLine1": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "paymentMethod": "card"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "orderNumber": "ORD-20240516-1234",
    "user": "507f1f77bcf86cd799439011",
    "items": [ /* order items */ ],
    "shippingAddress": { /* address */ },
    "paymentMethod": "card",
    "itemsPrice": 2599.98,
    "taxPrice": 389.99,
    "shippingPrice": 0,
    "totalPrice": 2989.97,
    "orderStatus": "pending",
    "paymentStatus": "pending"
  }
}
```

---

### Get My Orders
Get authenticated user's orders.

```http
GET /orders/my-orders
```

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Items per page

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [ /* array of orders */ ],
  "pagination": { /* pagination info */ }
}
```

---

### Get Single Order
Get order details.

```http
GET /orders/:id
```

**Headers:** `Authorization: Bearer <token>`

**Response:** `200 OK`
```json
{
  "success": true,
  "data": { /* order details */ }
}
```

---

### Cancel Order
Cancel pending order.

```http
PUT /orders/:id/cancel
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": { /* updated order */ }
}
```

---

### Get All Orders (Admin)
Get all orders.

```http
GET /orders
```

**Headers:** `Authorization: Bearer <admin_token>`

**Response:** `200 OK`

---

### Update Order Status (Admin)
Update order status.

```http
PUT /orders/:id/status
```

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "status": "shipped",
  "note": "Order shipped via FedEx"
}
```

**Response:** `200 OK`

---

## ⭐ Review Endpoints

### Create Review
Add product review.

```http
POST /products/:productId/reviews
```

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "rating": 5,
  "title": "Great product!",
  "comment": "Excellent quality and fast shipping"
}
```

**Response:** `201 Created`

---

### Get Product Reviews
Get all reviews for a product.

```http
GET /products/:productId/reviews
```

**Response:** `200 OK`

---

## 🔒 Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "User role 'customer' is not authorized to access this route"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": "Too many requests from this IP, please try again later"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Server Error"
}
```

---

## 📊 Rate Limiting

- **General API**: 100 requests per 15 minutes
- **Auth endpoints**: 5 requests per 15 minutes
- **Password reset**: 3 requests per hour
- **Email verification**: 3 requests per hour

---

## 🔐 Security Headers

All responses include security headers:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- All prices are in USD
- Pagination defaults: page=1, limit=20
- Maximum page size: 100 items
- Cache TTL: 3600 seconds (1 hour)

---

**API Version: v1**
**Last Updated: 2024**
