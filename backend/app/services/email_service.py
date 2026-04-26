# import smtplib
# import os
# from email.mime.text import MIMEText
# from email.mime.multipart import MIMEMultipart
# from datetime import datetime, timedelta
# from jose import jwt
# from .config import SECRET_KEY, ALGORITHM

# # Email configuration from environment
# SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
# SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
# SMTP_USER = os.getenv("SMTP_USER", "")
# SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
# SENDER_EMAIL = os.getenv("SENDER_EMAIL", "noreply@freelance-marketplace.com")
# FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5174")
# FRONTEND_URL = os.getenv("FRONTEND_URL", "https://freelance-hub-b79837.netlify.app/")

# def generate_password_reset_token(email: str, expires_in_hours: int = 24) -> str:
#     """Generate a password reset token that expires in 24 hours"""
#     expires = datetime.utcnow() + timedelta(hours=expires_in_hours)
#     payload = {"email": email, "exp": expires}
#     token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
#     return token


# def verify_password_reset_token(token: str) -> str | None:
#     """Verify and extract email from password reset token"""
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         email = payload.get("email")
#         return email
#     except:
#         return None


# def send_password_reset_email(email: str, reset_token: str) -> bool:
#     """Send password reset email"""
#     try:
#         # Create reset URL
#         reset_url = f"{FRONTEND_URL}/reset-password?token={reset_token}"
        
#         # Create email message
#         msg = MIMEMultipart()
#         msg["From"] = SENDER_EMAIL
#         msg["To"] = email
#         msg["Subject"] = "Reset Your Freelance Marketplace Password"
        
#         # Email body with HTML formatting
#         html_body = f"""
#         <html>
#             <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
#                 <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
#                     <h2 style="color: #4f46e5;">Reset Your Password</h2>
                    
#                     <p>Hi there,</p>
                    
#                     <p>We received a request to reset your password. Click the link below to create a new password:</p>
                    
#                     <p style="margin: 30px 0;">
#                         <a href="{reset_url}" style="display: inline-block; padding: 12px 30px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
#                             Reset Password
#                         </a>
#                     </p>
                    
#                     <p>Or copy this link in your browser:</p>
#                     <p style="word-break: break-all; color: #666; font-size: 12px;">{reset_url}</p>
                    
#                     <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                    
#                     <p style="font-size: 12px; color: #666;">
#                         <strong>⏱️ This link expires in 24 hours.</strong><br>
#                         If you didn't request this, please ignore this email.
#                     </p>
                    
#                     <p style="font-size: 12px; color: #666;">
#                         Best regards,<br>
#                         <strong>Freelance Marketplace Team</strong>
#                     </p>
#                 </div>
#             </body>
#         </html>
#         """
        
#         msg.attach(MIMEText(html_body, "html"))
        
#         # Send email
#         if SMTP_USER and SMTP_PASSWORD:
#             server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
#             server.starttls()
#             server.login(SMTP_USER, SMTP_PASSWORD)
#             server.send_message(msg)
#             server.quit()
#             return True
#         else:
#             print("⚠️ Email service not configured. Token:", reset_token)
#             print("Reset URL:", reset_url)
#             return True  # Return True for development without email service
            
#     except Exception as e:
#         print(f"❌ Error sending email: {str(e)}")
#         return False
