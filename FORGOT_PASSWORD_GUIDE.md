# 🔐 Password Reset Feature Documentation

## Overview
Users can now reset their forgotten password through email. The feature includes:
- Forgot Password page with email input
- Password reset email with secure token
- Reset Password page to create new password
- Token expiration (24 hours)
- Secure password hashing

## Features Implemented

### 1. **Frontend Components**

#### ForgotPassword.jsx
- Email input form
- Email validation
- Success confirmation screen
- Link back to login
- Dark mode support

#### ResetPassword.jsx
- Token validation on load
- New password input with confirmation
- Password matching validation
- Success/error handling
- Auto-redirect to login on success

### 2. **Backend Endpoints**

#### POST `/auth/forgot-password`
Request:
```json
{
  "email": "user@example.com"
}
```
Response:
```json
{
  "message": "Password reset link sent to your email.",
  "success": true
}
```

#### POST `/auth/reset-password`
Request:
```json
{
  "token": "jwt-token-from-email",
  "new_password": "newpassword123"
}
```
Response:
```json
{
  "message": "Password reset successfully. Please login with your new password.",
  "success": true
}
```

#### POST `/auth/verify-reset-token`
Request:
```json
{
  "token": "jwt-token-from-email"
}
```
Response:
```json
{
  "valid": true,
  "email": "user@example.com",
  "message": "Token is valid"
}
```

### 3. **Email Service**

**File**: `server/app/email_service.py`

Functions:
- `generate_password_reset_token()` - Creates JWT token with 24-hour expiration
- `verify_password_reset_token()` - Validates token and extracts email
- `send_password_reset_email()` - Sends HTML email with reset link

### 4. **Routes Added**

Frontend routes:
- `/forgot-password` - Forgot password page
- `/reset-password?token=xxx` - Password reset page

## Email Configuration

### Gmail Setup (Recommended for Development)

1. **Enable 2-Factor Authentication**
   - Go to myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**
   - Go to myaccount.google.com/apppasswords
   - Select Mail and Windows Computer
   - Copy the 16-character password

3. **Update .env file**
```env
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password-from-google
SENDER_EMAIL=your-email@gmail.com
FRONTEND_URL=http://localhost:5174
```

### Other Email Providers

**SendGrid:**
```env
SMTP_SERVER=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.xxxxxxx
```

**Mailgun:**
```env
SMTP_SERVER=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.com
SMTP_PASSWORD=your-password
```

## User Flow

### Forgot Password Flow
```
1. User clicks "Forgot password?" link on Login page
2. → Redirected to /forgot-password
3. User enters email
4. → Backend sends reset email with token
5. Email contains reset link with token
6. User clicks link → Redirected to /reset-password?token=xxx
7. Frontend validates token
8. User enters new password
9. → Backend updates password
10. → Success message, auto-redirect to login
```

## Security Features

✅ **JWT Token with Expiration**
- Tokens expire after 24 hours
- Can't reuse same token twice

✅ **Password Hashing**
- Passwords hashed with bcrypt
- Original password never stored

✅ **Email Validation**
- Uses pydantic EmailStr validator
- Prevents invalid email submissions

✅ **User Privacy**
- Doesn't reveal if email exists
- Same response for valid/invalid emails

✅ **Token Verification**
- Validates token before showing reset form
- Shows error if expired/invalid

## Testing

### Test Locally Without Email Service

1. **Without Gmail configured:**
   - Password reset token will log to console
   - Copy the token manually
   - Open: `http://localhost:5174/reset-password?token=PASTE_TOKEN_HERE`

2. **Console Output:**
   ```
   ⚠️ Email service not configured. Token: eyJ0eXAiOiJKV1QiLCJhbGc...
   Reset URL: http://localhost:5174/reset-password?token=eyJ0eXAiOiJKV1QiLCJhbGc...
   ```

### Test With Gmail

1. Set up Gmail credentials in .env
2. Go to /forgot-password
3. Enter your email
4. Check inbox for reset email
5. Click link and reset password

## Environment Variables

Add to your `.env` file:

```env
# Email Configuration
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=your-email@gmail.com
FRONTEND_URL=http://localhost:5174
```

For production:
```env
FRONTEND_URL=https://your-app.onrender.com
```

## Troubleshooting

### Email not sending
- Check SMTP credentials in .env
- Verify email service is configured
- Check server logs for error messages
- For Gmail: Verify app password is correct

### Invalid token errors
- Token might have expired (24-hour limit)
- User should request new reset email
- Check browser console for specific error

### Password reset not working
- Ensure new password meets minimum requirements (6+ characters)
- Confirm passwords match
- Check MongoDB connection is working
- Verify user exists in database

## Files Modified/Created

**Backend:**
- ✅ Created: `server/app/email_service.py`
- ✅ Updated: `server/app/auth.py` (added 3 new endpoints)
- ✅ Updated: `server/app/requirements.txt` (added aiosmtplib, email-validator)

**Frontend:**
- ✅ Created: `freelance-marketplace/src/pages/ForgotPassword.jsx`
- ✅ Created: `freelance-marketplace/src/pages/ResetPassword.jsx`
- ✅ Updated: `freelance-marketplace/src/App.jsx` (added 2 new routes)
- ✅ Updated: `freelance-marketplace/src/pages/Login.jsx` (added forgot password link)

**Config:**
- ✅ Updated: `.env.example` (added email configuration)

## Next Steps

1. Configure email service (Gmail recommended)
2. Add email credentials to .env file
3. Restart backend server
4. Test the password reset flow
5. Deploy to Render with email credentials in environment variables
