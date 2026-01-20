# Quick Setup: Email Password Reset

## Problem: setTheme Error ✅ FIXED
The Navbar theme toggle wasn't working. Fixed in Navbar.jsx line 34.

## Problem: Not Receiving Reset Emails
The email service needs SMTP configuration. Here's the quick fix:

## 5-Minute Gmail Setup

### 1. Enable 2FA on Gmail
- Go to: https://myaccount.google.com/security
- Enable "2-Step Verification"

### 2. Generate App Password
- Go to: https://myaccount.google.com/apppasswords
- Select "Mail" → "Windows Computer"
- Copy the 16-character password

### 3. Update .env File
Add these lines to your `.env` file in the root directory:

```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
SENDER_EMAIL=your-email@gmail.com
FRONTEND_URL=http://localhost:5174
```

### 4. Restart Backend
- Stop the backend server (Ctrl+C)
- Run it again
- The email service is now active!

### 5. Test It
- Go to: http://localhost:5174/forgot-password
- Enter your Gmail email
- **Check your inbox!** 📧

---

## If You Don't Want to Set Up Email

The app will still work - it just logs the reset token to the backend console:

1. Go to /forgot-password
2. Enter any email
3. Look in the **backend terminal** - copy the token
4. Visit: `http://localhost:5174/reset-password?token=PASTE_TOKEN`
5. Set your new password

---

## For Netlify Deployment

When deploying to Netlify (frontend) + Render (backend):

**Add to Render Environment Variables:**
```env
FRONTEND_URL=https://your-netlify-site.netlify.app
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
```

---

## Files Changed Today
- ✅ Navbar.jsx - Fixed theme toggle
- ✅ email_service.py - Fixed FRONTEND_URL to 5174 + support Netlify
- ✅ EMAIL_SETUP_GUIDE.md - Complete setup instructions

Both servers running and ready! 🚀
