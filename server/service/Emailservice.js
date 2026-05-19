const nodemailer=require("nodemailer");
require ("dotenv").config();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Google's mail server
  port: 465, // SSL port
  secure: true, // Enable SSL

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

  console.log("Generated OTP inside function:", generateOTP); // Debug
  
async function sendOTP(toEmail,username,otpCode){
   try{
     const info = await transporter.sendMail({
       from: `"BookStore Security" <${process.env.EMAIL_USER}>`,

       to: toEmail,
       subject: "you login otp",
       html: `
        <div style="font-family: Arial; padding: 20px; text-align: center;">
      <h2>Hello ${username}!</h2>
         <h1 style="font-size: 48px; color: #667eea;">${otpCode}</h1>
          <p>Valid for 30sec.</p>
        </div>
       `,
     });
     console.log(` OTP ${otpCode} sent to ${toEmail}`);
     return info;
}
        catch (error) {
    console.error("❌ Send error:", error.message);
     
   }
}
async function sendForgotPasswordOTP(toEmail, username, otpCode) {
  try {
    const info = await transporter.sendMail({
      from: `"BookStore Security" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "🔐 Reset Your Password - OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 20px; border-radius: 10px 10px 0 0; margin: -20px -20px 20px -20px;">
            <h1 style="color: white; margin: 0;">🔐 Password Reset</h1>
          </div>
          <div style="text-align: center;">
            <h2>Hello ${username}!</h2>
            <p>We received a request to reset your password.</p>
            <p>Your OTP code for password reset is:</p>
            <div style="font-size: 48px; font-weight: bold; letter-spacing: 10px; color: #f5576c; background: #fff0f0; padding: 20px; border-radius: 10px; margin: 20px 0;">
              ${otpCode}
            </div>
            <p>This code expires in <strong>30seconds</strong>.</p>
            <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
            <hr style="margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">For security reasons, never share this OTP with anyone.</p>
          </div>
        </div>
      `,
    });
    console.log(` Forgot Password OTP ${otpCode} sent to ${toEmail}`);
    return info;
  } catch (error) {
    console.error("❌ Send error:", error.message);
    throw error;
  }
}

// Generate OTP for forgot password (same 4-digit)
const generateForgotPasswordOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};


module.exports = {
  generateOTP,
  sendOTP,
  generateForgotPasswordOTP,
  sendForgotPasswordOTP,
};