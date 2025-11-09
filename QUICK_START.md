# Quick Start Guide

Get your ProgrammedStyle website running in 5 minutes!

## Prerequisites Check

```bash
node --version   # Should be v16 or higher
npm --version    # Should be installed
```

If not installed, download from [nodejs.org](https://nodejs.org/)

## Installation (3 Steps)

### 1. Install Dependencies

```bash
# From project root
npm run install-all
```

### 2. Setup Environment Variables

**Backend** - Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/programmedstyle
JWT_SECRET=your_random_secret_key_here
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@yourcompany.com
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_app_password
ADMIN_EMAIL=admin@yourcompany.com
ADMIN_PASSWORD=your_secure_password
CLIENT_URL=http://localhost:3000
```

**Frontend** - Create `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 3. Create Admin User

```bash
npm run create-admin
```

Follow the prompts to create your admin account.

## Run the Application

```bash
npm run dev
```

This will start both backend and frontend servers.

- **Website**: http://localhost:3000
- **Admin**: http://localhost:3000/admin/login
- **API**: http://localhost:5000/api

## First Steps

1. ✅ Open http://localhost:3000 - See your website
2. ✅ Test the contact form
3. ✅ Try the live chat (bottom-right corner)
4. ✅ Login to admin at http://localhost:3000/admin/login
5. ✅ Check messages in admin dashboard

## Troubleshooting

### MongoDB Not Running?

**Option 1**: Install MongoDB locally
```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Windows - Download installer from mongodb.com
```

**Option 2**: Use MongoDB Atlas (Cloud)
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create cluster
4. Get connection string
5. Update MONGODB_URI in server/.env

### Port Already in Use?

Change ports in your .env files:
```env
# server/.env
PORT=5001

# client/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5001
```

## Need Detailed Instructions?

See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for comprehensive setup instructions.

## Need Help?

- Check [README.md](./README.md) for full documentation
- Review error messages in the console
- Ensure all environment variables are set

---

**You're all set!** 🚀 Start customizing your website!

