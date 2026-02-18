# MERN Authentication System

A production-ready, full-stack authentication solution built with MongoDB, Express.js, React, and Node.js. This project demonstrates best practices in security, validation, rate limiting, and email verification.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Security Features](#security-features)
- [Database Schema](#database-schema)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Features

### 🔐 Core Authentication

- **User Registration** - Secure user registration with email verification
- **Email Verification** - Token-based email verification with 5-minute expiration
- **User Login** - Secure login with JWT token generation
- **Password Hashing** - BCrypt hashing with salt rounds for enhanced security
- **Role-Based Access** - User roles system (default: user role)

### 🛡️ Security Features

- **Rate Limiting** - Redis-based rate limiting for registration and login endpoints
- **Input Validation** - Zod schema validation for all inputs
- **MongoDB Sanitization** - Protection against NoSQL injection attacks
- **JWT Authentication** - Secure token-based authentication
- **CORS Support** - Configured for cross-origin requests
- **Environment Variables** - Sensitive data management with dotenv

### ⚡ Performance & Caching

- **Redis Integration** - Fast caching and session management
- **Token Storage** - Efficient temporary token storage with TTL
- **Rate Limit Tracking** - Redis-based rate limit tracking

### 📧 Communication

- **Email Notifications** - Nodemailer integration for email verification
- **HTML Templates** - Professional HTML email templates
- **Error Messages** - User-friendly error responses

### 🎯 Developer Experience

- **Try-Catch Middleware** - Centralized error handling
- **Hot Reload** - Nodemon for development with auto-restart
- **Modular Architecture** - Organized code structure by feature
- **API Versioning** - v1 API endpoints with future scalability

## Tech Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Redis** - Caching and session store
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Zod** - Schema validation
- **Nodemailer** - Email service
- **Mongo-sanitize** - NoSQL injection prevention

### Frontend

- React (to be implemented)

### Development Tools

- **Nodemon** - Development server with auto-restart
- **dotenv** - Environment variable management

## Project Structure

```
MERN/
├── README.md
├── backend/
│   ├── index.js                 # Entry point & server configuration
│   ├── package.json             # Project dependencies
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   ├── html.js             # Email HTML templates
│   │   ├── sendMail.js         # Email configuration
│   │   └── zod.js              # Validation schemas
│   ├── controllers/
│   │   └── user.js             # User authentication logic
│   ├── middlewares/
│   │   └── tryCatch.js         # Error handling middleware
│   ├── models/
│   │   └── User.js             # User schema & model
│   └── routes/
│       └── user.js             # Authentication routes
└── frontend/                    # React frontend (to be implemented)
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local or MongoDB Atlas)
- **Redis** server (local or Redis Cloud)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd MERN
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

# Redis
REDIS_URL=redis://localhost:6379

# Email Service (Gmail/SendGrid/Custom)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Server
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

### 4. Start the Backend Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## Environment Variables

| Variable         | Description               | Example                                          |
| ---------------- | ------------------------- | ------------------------------------------------ |
| `MONGODB_URI`    | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `REDIS_URL`      | Redis server URL          | `redis://localhost:6379`                         |
| `PORT`           | Server port               | `5000`                                           |
| `NODE_ENV`       | Environment mode          | `development` or `production`                    |
| `EMAIL_HOST`     | SMTP server host          | `smtp.gmail.com`                                 |
| `EMAIL_PORT`     | SMTP server port          | `587`                                            |
| `EMAIL_USER`     | Email account username    | `your-email@gmail.com`                           |
| `EMAIL_PASSWORD` | Email account password    | `app-password`                                   |
| `JWT_SECRET`     | Secret key for JWT tokens | `your-secret-key`                                |
| `JWT_EXPIRES_IN` | JWT token expiration time | `7d`                                             |

## API Endpoints

### Authentication Routes (`/api/v1`)

#### 1. Register User

```
POST /api/v1/register
Content-Type: application/json

Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

Response (201):
{
  "success": true,
  "message": "If your email is valid, you will receive a verification email shortly and expires in 5 minutes"
}

Response (400):
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**Features:**

- Email validation
- Password strength requirements
- Duplicate email detection
- Rate limiting (1 request per 60 seconds per email)
- Verification token generation and storage in Redis (5-minute expiration)
- Email verification link sent to user

---

#### 2. Verify Email

```
POST /api/v1/verify/:token
or
GET /api/v1/verify/:token

Response (201):
{
  "success": true,
  "message": "Email verified successfully. Your account is created.",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

Response (400):
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**Features:**

- Token validation
- Automatic account creation upon verification
- Token auto-deletion from Redis after use
- Duplicate email prevention

---

#### 3. Login User

```
POST /api/v1/login
Content-Type: application/json

Request Body:
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}

Response (401):
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Features:**

- Email and password validation
- Secure password comparison
- JWT token generation
- Rate limiting (5 failed attempts per 15 minutes)
- User profile return

## Security Features

### 🔒 Input Validation

- **Zod Schema Validation** - Type-safe validation for all inputs
- **Email Format Validation** - RFC 5322 compliant email validation
- **Password Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character

### 🛡️ NoSQL Injection Prevention

- **Mongo-Sanitize** - Removes `$` and `.` characters from user input
- **Request Body Sanitization** - Applied to all incoming requests

### ⏱️ Rate Limiting

- **Registration Rate Limit** - 1 request per 60 seconds per email
- **Login Rate Limit** - 5 failed attempts within 15 minutes
- **IP-based Tracking** - Limits per IP address for distributed defense
- **Redis-backed** - Fast in-memory rate limit checking

### 🔐 Password Security

- **BCrypt Hashing** - Industry-standard password hashing
- **Salt Rounds** - 10 salt rounds for optimal security/performance balance
- **Never Stored Plain** - Passwords are hashed before storage

### 📧 Email Verification

- **Token-based** - Secure random token generation using crypto
- **Time-limited** - 5-minute expiration for verification tokens
- **One-time Use** - Tokens are deleted after successful verification

### 🚀 Additional Security

- **Environment Variables** - Sensitive data never hardcoded
- **Error Messages** - Generic error messages to prevent information leakage
- **HTTPS Ready** - Can be deployed with HTTPS/TLS

## Database Schema

### User Model

```javascript
{
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: "user"
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**

- `email` - Unique index for fast lookups and duplicate prevention

**Timestamps:** Automatically tracked with MongoDB timestamps

## Error Handling

All errors follow a consistent response format:

```javascript
{
  "success": false,
  "message": "Human-readable error message",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error"
    }
  ]
}
```

### Common Status Codes

| Code | Meaning           | Scenario                                |
| ---- | ----------------- | --------------------------------------- |
| 201  | Created           | Successful registration or verification |
| 200  | OK                | Successful login                        |
| 400  | Bad Request       | Invalid input, validation failures      |
| 401  | Unauthorized      | Invalid credentials                     |
| 429  | Too Many Requests | Rate limit exceeded                     |
| 500  | Server Error      | Unexpected server error                 |

## Best Practices Implemented

✅ **Modular Architecture** - Separated concerns (routes, controllers, models, config)

✅ **Error Handling** - Centralized error handling middleware

✅ **Security** - Multiple layers of security (validation, sanitization, rate limiting)

✅ **Performance** - Redis caching and efficient database queries

✅ **Scalability** - API versioning, modular structure for easy expansion

✅ **Code Quality** - Consistent error responses and validation

✅ **Environment Management** - Configuration through environment variables

## Future Enhancements

- [ ] JWT token refresh mechanism
- [ ] Password reset functionality
- [ ] OAuth 2.0 integration (Google, GitHub)
- [ ] Two-factor authentication (2FA)
- [ ] Email confirmation resend endpoint
- [ ] User profile management
- [ ] Account deletion endpoint
- [ ] Comprehensive API documentation (Swagger/OpenAPI)
- [ ] Unit and integration tests

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

---

**Built with ❤️ by your development team**

For questions or support, please reach out through GitHub issues or email.
