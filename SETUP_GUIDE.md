# ProgrammedStyle Website - Complete Setup Guide

This guide will walk you through setting up the ProgrammedStyle website from scratch.

## Step 1: Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Either:
  - [MongoDB Community Edition](https://www.mongodb.com/try/download/community) (local installation)
  - OR [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud database - recommended)
- **Git** - [Download here](https://git-scm.com/)

## Step 2: Email Service Setup

You need at least one email service configured. We recommend setting up both for redundancy.

### Option A: SendGrid (Primary Method)

1. Go to [SendGrid](https://sendgrid.com/) and create a free account
2. Navigate to Settings → API Keys
3. Click "Create API Key"
4. Give it a name and select "Full Access"
5. Copy the API key (you won't see it again!)
6. Go to Settings → Sender Authentication
7. Verify a sender email address

### Option B: Gmail (Fallback Method)

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Generate a new app password for "Mail"
5. Copy the 16-character password

## Step 3: MongoDB Setup

### Option A: MongoDB Atlas (Cloud - Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (free tier is fine)
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database password
7. Replace `myFirstDatabase` with `programmedstyle`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/programmedstyle?retryWrites=true&w=majority
```

### Option B: Local MongoDB

If you installed MongoDB locally, your connection string will be:
```
mongodb://localhost:27017/programmedstyle
```

## Step 4: Clone and Install

1. Open terminal/command prompt
2. Navigate to where you want the project
3. If you have the project folder already, navigate into it:

```bash
cd "ProgrammedStyle Website"
```

4. Install backend dependencies:

```bash
cd server
npm install
```

5. Install frontend dependencies:

```bash
cd ../client
npm install
```

## Step 5: Configure Environment Variables

### Backend (.env file)

1. In the `server` folder, create a file named `.env` (or edit existing one)
2. Copy the following and replace with your actual values:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB - Replace with your connection string
MONGODB_URI=mongodb://localhost:27017/programmedstyle

# JWT Secret - Generate a random secure string
# You can use: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_super_secure_random_jwt_secret_here

# SendGrid Configuration (if using SendGrid)
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@yourcompany.com

# Gmail Configuration (fallback)
GMAIL_USER=your.email@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# Google OAuth (Optional - leave as is for now)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Facebook OAuth (Optional - leave as is for now)
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=

# Admin Configuration - This is YOUR admin account
ADMIN_EMAIL=admin@yourcompany.com
ADMIN_PASSWORD=YourSecurePassword123!

# Client URL
CLIENT_URL=http://localhost:3000
```

### Frontend (.env.local file)

1. In the `client` folder, create a file named `.env.local`
2. Add the following:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

## Step 6: Create Admin Account

1. Make sure MongoDB is running
2. Open terminal in the `server` folder
3. Run the admin creation script:

```bash
node scripts/createAdmin.js
```

4. Follow the prompts to enter:
   - Your name
   - Your email (this will be your admin login)
   - Your password (minimum 8 characters)

5. Save these credentials securely!

## Step 7: Start the Application

You'll need TWO terminal windows/tabs:

### Terminal 1 - Backend Server

```bash
cd server
npm run dev
```

You should see:
```
✓ MongoDB connected successfully
✓ Server running on port 5000
✓ Environment: development
```

### Terminal 2 - Frontend Website

```bash
cd client
npm run dev
```

You should see:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

## Step 8: Test Your Website

1. **Main Website**: Open [http://localhost:3000](http://localhost:3000)
   - You should see a beautiful green-themed homepage
   - Scroll through all sections
   - Try the contact form
   - Click the chat button in the bottom-right corner

2. **Admin Dashboard**: Open [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
   - Login with the email and password you created in Step 6
   - You should see the admin dashboard
   - Check chat messages and contact form submissions

## Step 9: Verify Email Functionality

1. Fill out the contact form on the main website
2. Check that you receive:
   - An email notification to your admin email
   - An auto-reply to the sender's email
3. Check the admin dashboard to see the submission

## Troubleshooting

### MongoDB Connection Issues

**Error**: `MongoServerError: Authentication failed`
- Check your MongoDB connection string
- Verify your database password
- Make sure IP is whitelisted in MongoDB Atlas

**Error**: `MongooseServerSelectionError: connect ECONNREFUSED`
- Make sure MongoDB is running
- For local MongoDB, start it with: `mongod`

### Email Issues

**Error**: Email not sending
- Check your SendGrid API key is valid
- Verify your sender email is verified in SendGrid
- For Gmail, make sure you're using an App Password, not your regular password
- Check the console for error messages

### Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`
- Another application is using port 5000
- Change the PORT in server/.env to 5001 or another free port
- Update NEXT_PUBLIC_API_URL in client/.env.local accordingly

### Cannot GET /api/...

- Make sure the backend server is running
- Check that NEXT_PUBLIC_API_URL in client/.env.local matches your server port

## Production Deployment

### Preparation

1. Set `NODE_ENV=production` in backend
2. Use MongoDB Atlas (not local MongoDB)
3. Generate a new, secure JWT_SECRET
4. Set up proper domain and SSL certificate
5. Configure CORS with your actual domain
6. Update CLIENT_URL with your production URL

### Recommended Platforms

- **Frontend**: [Vercel](https://vercel.com) (easiest for Next.js)
- **Backend**: [Railway](https://railway.app), [Render](https://render.com), or [Heroku](https://heroku.com)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## Next Steps

1. **Customize Content**: Edit the content in the frontend components
2. **Add Logo**: Replace the CodeIcon with your actual logo
3. **Update Contact Info**: Change email, phone, and address in Footer.js and Contact.js
4. **Add Your Projects**: Update the portfolio section with your actual projects
5. **Configure Domain**: Set up your custom domain
6. **Analytics**: Add Google Analytics or similar
7. **Social Media**: Link your actual social media accounts

## Need Help?

If you encounter any issues:

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Make sure all services (MongoDB, backend, frontend) are running
4. Check the logs for detailed error information

## Security Reminders

- ✅ Never commit `.env` files to Git
- ✅ Use strong passwords for admin accounts
- ✅ Keep dependencies updated
- ✅ Use HTTPS in production
- ✅ Regularly backup your database
- ✅ Monitor for security vulnerabilities

---

**Congratulations!** Your ProgrammedStyle website should now be up and running! 🎉

