const nodemailer = require('nodemailer');
const path = require('path');

// Ensure .env is loaded (using absolute path for reliability)
require('dotenv').config({ path: path.join(__dirname, '.env') });

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Email Service Error:", error.message);
    } else {
        console.log("✅ Email SMTP Server is ready (Service)");
    }
});

/**
 * Sends a registration confirmation email.
 * @param {Object} details - The registration details.
 * @param {string} details.leaderEmail - Recipient email.
 * @param {string} details.leaderName - Recipient name.
 * @param {string} details.teamName - Team name.
 * @param {string} details.regId - Registration ID.
 */
const sendConfirmationEmail = async ({ leaderEmail, leaderName, teamName, regId }) => {
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
        console.log(`✅ Confirmation email sent to ${leaderEmail}`);
        return info;
    } catch (error) {
        console.error(`❌ Email sending failed for ${leaderEmail}:`, error.message);
        throw error;
    }
};

module.exports = { sendConfirmationEmail };
