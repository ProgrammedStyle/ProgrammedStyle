# ProgrammedStyle Website

A modern, professional web development company website built with React, Next.js, Node.js, Express.js, and MongoDB.

## Features

✨ **Modern Design**: Beautiful, professional green-themed UI with Material UI
🚀 **High Performance**: Optimized for speed and SEO
💬 **Live Chat**: Real-time chat functionality using Socket.IO
📧 **Contact Form**: Email integration with SendGrid and Gmail fallback
👨‍💼 **Admin Dashboard**: Comprehensive admin panel for managing messages
🔒 **Secure**: JWT authentication, helmet.js, rate limiting
📱 **Responsive**: Mobile-first design that works on all devices
♿ **Accessible**: WCAG compliant components

## Tech Stack

### Frontend
- **Framework**: Next.js 14
- **UI Library**: Material UI 5
- **Animations**: Framer Motion
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Email**: SendGrid (primary), Nodemailer/Gmail (fallback)
- **Real-time**: Socket.IO
- **Security**: Helmet, Express Rate Limit, bcryptjs

## Getting Started

### Prerequisites

- Node.js 16+ installed
- MongoDB running locally or MongoDB Atlas account
- SendGrid API key (optional, can use Gmail)
- Gmail app password (optional, for fallback)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd "ProgrammedStyle Website"
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../client
npm install
```

4. **Configure Environment Variables**

Create a `.env` file in the `server` folder with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/programmedstyle

# JWT Secret (change this to a random secure string)
JWT_SECRET=your_super_secure_jwt_secret_change_this_in_production

# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourcompany.com

# Gmail Fallback Configuration
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_gmail_app_password

# Google OAuth (Optional - for future use)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Facebook OAuth (Optional - for future use)
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret

# Admin Configuration
ADMIN_EMAIL=admin@yourcompany.com
ADMIN_PASSWORD=change_this_secure_password

# Client URL
CLIENT_URL=http://localhost:3000
```

Create a `.env.local` file in the `client` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

5. **Create Admin User**

Run the following command to create an admin account:

```bash
cd server
node scripts/createAdmin.js
```

Or use the API endpoint (one-time only):

```bash
curl -X POST http://localhost:5000/api/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yourcompany.com",
    "password": "your_secure_password",
    "name": "Admin User"
  }'
```

### Running the Application

1. **Start the Backend Server**
```bash
cd server
npm run dev
```

The server will run on http://localhost:5000

2. **Start the Frontend (in a new terminal)**
```bash
cd client
npm run dev
```

The website will be available at http://localhost:3000

3. **Access the Admin Dashboard**

Navigate to http://localhost:3000/admin/login and sign in with your admin credentials.

## Project Structure

```
ProgrammedStyle Website/
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Next.js pages
│   │   ├── styles/        # Global styles
│   │   └── theme/         # Material UI theme
│   ├── package.json
│   └── next.config.js
│
├── server/                # Express.js backend
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Custom middleware
│   ├── scripts/          # Utility scripts
│   ├── package.json
│   └── server.js         # Entry point
│
└── README.md
```

## API Endpoints

### Public Endpoints

- `POST /api/contact` - Submit contact form
- `GET /api/health` - Health check

### Authentication

- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/create-admin` - Create admin user (one-time)

### Admin Endpoints (requires authentication)

- `GET /api/contact` - Get all contact submissions
- `PUT /api/contact/:id/status` - Update contact status
- `GET /api/chat/messages` - Get all chat messages
- `GET /api/chat/messages/session/:sessionId` - Get messages by session
- `PUT /api/chat/messages/:id/read` - Mark message as read
- `POST /api/chat/messages/:id/reply` - Reply to message
- `GET /api/chat/stats` - Get chat statistics

## Email Configuration

### SendGrid Setup

1. Sign up at https://sendgrid.com
2. Create an API key
3. Verify your sender email
4. Add the API key to your `.env` file

### Gmail Setup (Fallback)

1. Enable 2-Factor Authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Add your Gmail and App Password to the `.env` file

The system automatically falls back to Gmail if SendGrid fails.

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Helmet.js**: Security headers
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Express Validator
- **CORS**: Configured for specific origins
- **Environment Variables**: Sensitive data protection

## SEO Features

- Server-side rendering with Next.js
- Meta tags optimization
- Open Graph tags
- Twitter Card tags
- Semantic HTML
- Mobile-friendly design
- Fast loading times
- Sitemap ready

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Backend (Heroku/Railway/DigitalOcean)

1. Set up MongoDB Atlas
2. Configure environment variables
3. Deploy backend
4. Update `NEXT_PUBLIC_API_URL` in frontend

## Contributing

This is a proprietary project for ProgrammedStyle. Please contact the administrator for contribution guidelines.

## License

Copyright © 2024 ProgrammedStyle. All rights reserved.

## Support

For support, email admin@programmedstyle.com or use the live chat on the website.

## Authors

- ProgrammedStyle Development Team

---

Built with ❤️ by ProgrammedStyle

# ProgrammedStyle
