# Email Service Setup Guide

## Why You're Not Receiving Emails

The email service requires SMTP credentials to be configured. Without them, it just logs the token to console.

## Setup Email Service

### Option 1: Gmail (Free & Easiest)

#### Step 1: Enable 2-Factor Authentication
1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Click "2-Step Verification"
3. Follow the steps to enable it

#### Step 2: Generate App Password
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer"
3. Google will generate a 16-character password
4. Copy it (save somewhere safe)

#### Step 3: Add to .env File

**Windows/macOS** - Open `.env` file in the root directory:

```env
# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
SENDER_EMAIL=your-email@gmail.com
FRONTEND_URL=http://localhost:5174
```

⚠️ **Important**: Use the 16-character password from Google, including the spaces.

#### Step 4: Restart Backend
```bash
# Kill the running backend (Ctrl+C in terminal)
# Then restart it:
cd server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

#### Step 5: Test Password Reset
1. Go to http://localhost:5174/login
2. Click "Reset it here"
3. Enter your Gmail email address
4. **Check your inbox** (or spam folder)
5. You should receive the reset email!

---

## Option 2: SendGrid (Professional)

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create API key
3. Add to .env:

```env
SMTP_SERVER=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxxxxxxxxxxxxx
SENDER_EMAIL=noreply@yourdomain.com
FRONTEND_URL=http://localhost:5174
```

---

## Option 3: Mailgun (Professional)

1. Sign up at [mailgun.com](https://mailgun.com)
2. Get SMTP credentials
3. Add to .env:

```env
SMTP_SERVER=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@yourdomain.com
SMTP_PASSWORD=your-password
SENDER_EMAIL=noreply@yourdomain.com
FRONTEND_URL=http://localhost:5174
```

---

## Testing Without Email Service

If you don't want to set up email yet, the app will **log tokens to console**:

```
⚠️ Email service not configured. Token: eyJ0eXAiOiJKV1QiLCJhbGc...
Reset URL: http://localhost:5174/reset-password?token=eyJ0eXAiOiJKV1QiLCJhbGc...
```

**To test manually:**
1. Go to /forgot-password
2. Enter your email
3. Copy the token from the **backend console**
4. Visit: `http://localhost:5174/reset-password?token=PASTE_TOKEN_HERE`
5. Set your new password

---

## For Netlify Deployment

### Add Environment Variables:

1. Go to your Netlify site → Site settings → Build & deploy → Environment
2. Add these variables:

```env
MONGODB_URL=your-mongodb-connection-string
SECRET_KEY=your-secret-key-change-this
FRONTEND_URL=https://your-netlify-site.netlify.app
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=xxxx xxxx xxxx xxxx
SENDER_EMAIL=your-email@gmail.com
```

### Backend on Render:

1. Go to Render dashboard
2. Select your API service
3. Go to Environment
4. Add the same variables (SMTP settings)

---

## Troubleshooting

### Email not sending
- ✅ Check SMTP credentials are correct
- ✅ Check username/password have no typos
- ✅ Check Gmail app password (not your account password!)
- ✅ Verify email is in correct format
- ✅ Check firewall/VPN not blocking SMTP

### Still not working?
1. Check backend console for error messages
2. Verify .env file is saved
3. Restart the backend server
4. Check SMTP port 587 is not blocked

### Appears in spam?
- Add sender email to contacts
- Check spam filter settings
- Use verified domain (SendGrid/Mailgun)

---

## Quick Checklist

- [ ] Enabled 2FA on Gmail account
- [ ] Generated Google app password
- [ ] Added SMTP_USER, SMTP_PASSWORD to .env
- [ ] Added SENDER_EMAIL to .env
- [ ] Added FRONTEND_URL to .env (localhost:5174 for local)
- [ ] Restarted backend server
- [ ] Tested password reset flow
- [ ] Check email received or console shows token
