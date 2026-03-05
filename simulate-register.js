const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function simulateEmailSending(leaderEmail, leaderName, teamName, regId) {
    console.log(`🚀 Simulating email to: ${leaderEmail}`);
    console.log(`- SMTP User: ${process.env.EMAIL_USER}`);

    const mailOptions = {
        from: `IUCEE Team <${process.env.EMAIL_USER}>`,
        to: leaderEmail,
        subject: `Registration Successful - ${teamName}`,
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2c3e50; text-align: center;">Registration Confirmed!</h2>
        <p>Hello <strong>${leaderName}</strong>,</p>
        <p>Congratulations! Your team <strong>"${teamName}"</strong> has been successfully registered for the <strong>Sustainable Industry Sprint</strong>.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #34495e;">Event Details:</h3>
          <p><strong>Registration ID:</strong> <span style="font-size: 1.2em; color: #e67e22;">${regId}</span></p>
          <p><strong>Date:</strong> March 11th</p>
          <p><strong>Venue:</strong> SoEEE Seminar Hall</p>
        </div>

        <p>We are excited to see you and your team in action. If you have any questions, feel free to reach out to us.</p>
        <br>
        <p>Best Regards,</p>
        <p><strong>IUCEE Team</strong></p>
      </div>
    `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully!");
        console.log("Message ID:", info.messageId);
        console.log("Accepted:", info.accepted);
        console.log("Rejected:", info.rejected);
    } catch (error) {
        console.error("❌ Email sending failed:", error.message);
        if (error.code === 'EAUTH') {
            console.error("⚠️ Authentication Failed. Check your App Password.");
        }
    }
}

// Replace with a test email you want to verify
const testRecipient = process.env.EMAIL_USER;
simulateEmailSending(testRecipient, "Test User", "Debug Team", "SIS-1234");
