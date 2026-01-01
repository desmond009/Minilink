# 🔗 MiniLink - Professional URL Shortening Service

A modern, full-stack URL shortening application built with React and Node.js. Transform long URLs into short, shareable links with analytics, QR code generation, and user authentication.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)

## ✨ Features

- **🔗 URL Shortening**: Convert long URLs into short, manageable links
- **📊 Analytics Dashboard**: Track clicks, views, and detailed analytics for your links
- **📱 QR Code Generation**: Automatically generate QR codes for easy sharing
- **🔐 User Authentication**: Secure authentication with JWT tokens
- **🌐 OAuth Integration**: Sign in with Google, GitHub, or Apple
- **🎨 Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS
- **🌙 Dark Mode**: Toggle between light and dark themes
- **📈 Link Management**: View, edit, and delete your shortened URLs
- **⚡ Fast & Secure**: Built with performance and security best practices
- **📱 Mobile Responsive**: Works seamlessly on all devices

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router DOM** - Routing
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **QRCode React** - QR code generation
- **Chart.js / Recharts** - Analytics visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nanoid** - Unique ID generation
- **QRCode** - QR code generation
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance like MongoDB Atlas)

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Minilink
```

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Database
MONGODB_URI=mongodb://localhost:27017/minilink
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/minilink

# JWT
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# OAuth - Google (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/oauth/google/callback

# OAuth - GitHub (Optional)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=http://localhost:3000/api/oauth/github/callback

# CORS (Optional, defaults to FRONTEND_URL)
CORS_ORIGIN=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd Frontend
npm install
```

Create a `.env` file in the `Frontend` directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_SHORT_BASE_URL=http://localhost:3000
```

## 🏃 Running the Application

### Development Mode

**Backend:**
```bash
cd Backend
npm run dev
```

The backend server will start on `http://localhost:3000`

**Frontend:**
```bash
cd Frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### Production Build

**Frontend:**
```bash
cd Frontend
npm run build
npm run preview
```

**Backend:**
```bash
cd Backend
npm start
```

## 📁 Project Structure

```
Minilink/
├── Backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controller/      # Request handlers
│   │   ├── middleware/      # Custom middleware
│   │   ├── model/           # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── scripts/         # Utility scripts
│   │   └── utils/           # Helper functions
│   ├── app.js               # Express app entry point
│   └── package.json
│
├── Frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── common/      # Reusable UI components
│   │   │   ├── features/    # Feature components
│   │   │   ├── layout/      # Layout components
│   │   │   └── sections/    # Page sections
│   │   ├── context/         # React Context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Page components
│   │   ├── routes/          # Route configuration
│   │   ├── services/        # API service layer
│   │   ├── styles/          # Global styles
│   │   └── utils/           # Utility functions
│   ├── public/              # Static assets
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/change-password` - Change password

### OAuth
- `GET /api/oauth/google/url` - Get Google OAuth URL
- `GET /api/oauth/github/url` - Get GitHub OAuth URL
- `GET /api/oauth/apple/url` - Get Apple OAuth URL

### URL Shortening
- `POST /api/urls` - Create a new short URL
- `GET /api/urls` - Get user's URLs
- `GET /api/urls/:id` - Get specific URL details
- `PUT /api/urls/:id` - Update URL
- `DELETE /api/urls/:id` - Delete URL
- `GET /api/urls/:id/analytics` - Get URL analytics
- `GET /api/urls/:id/qrcode` - Get QR code for URL
- `GET /api/urls/stats/dashboard` - Get dashboard statistics

### Redirect
- `GET /r/:shortId` - Redirect to original URL

## 🔒 Security Features

- **Helmet.js** - Sets security HTTP headers
- **CORS** - Cross-Origin Resource Sharing configuration
- **Rate Limiting** - Prevents abuse with request rate limiting
- **Input Validation** - Express Validator for request validation
- **MongoDB Sanitization** - Prevents NoSQL injection attacks
- **JWT Authentication** - Secure token-based authentication
- **Bcrypt Password Hashing** - Secure password storage
- **HPP** - HTTP Parameter Pollution protection

## 🎯 Usage

### Creating a Short URL

1. Sign up or log in to your account
2. Enter your long URL in the input field
3. Click "Create Short Link"
4. Copy the generated short URL
5. Share it anywhere!

### Viewing Analytics

1. Go to your dashboard
2. Click on any link to view detailed analytics
3. View click statistics, referrers, devices, and more

### QR Code

- QR codes are automatically generated for all shortened URLs
- Download QR codes directly from the dashboard
- Share QR codes for easy mobile access

## 🧪 Development

### Running Tests

```bash
# Backend tests (if available)
cd Backend
npm test

# Frontend tests (if available)
cd Frontend
npm test
```

### Database Scripts

The `Backend/src/scripts/` directory contains utility scripts:

- `fix-shortid-index.js` - Fix database index issues
- `cleanup-null-shortids.js` - Clean up invalid database entries

Run scripts with:
```bash
cd Backend
node src/scripts/script-name.js
```

## 🌍 Environment Variables

### Required
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens (min 32 characters)

### Optional
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `APP_URL` - Backend base URL
- `FRONTEND_URL` - Frontend base URL
- OAuth credentials (Google, GitHub, Apple)

## 📝 License

ISC License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For support, email support@minilink.com or create an issue in the repository.

## 🙏 Acknowledgments

- Built with React and Node.js
- UI components styled with Tailwind CSS
- Icons provided by Lucide React

---

Made with ❤️ by the MiniLink Team

