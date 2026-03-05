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
        console.error("❌ Email SMTP Verification Failed:", error.message);
        console.log("💡 Tip: If using Gmail, make sure you use an 'App Password' and that 'Less Secure Apps' settings aren't blocking it.");
    } else {
        console.log("✅ Email SMTP Server is ready (Service)");
    }
});

// Create a version that uses Brevo if the key is present
const createBrevoTransporter = (apiKey) => {
    return nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false, // Port 587 uses STARTTLS
        auth: {
            user: process.env.BREVO_USER || process.env.EMAIL_USER,
            pass: apiKey
        },
        tls: {
            rejectUnauthorized: false // Avoid issues with self-signed certs or local proxies
        }
    });
};

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
        from: `"IUCEE Team" <${process.env.EMAIL_USER}>`,
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

    // Try Brevo first if key is present
    if (process.env.BREVO_SMTP_KEY) {
        try {
            console.log("📧 Attempting to send via Brevo SMTP...");
            const brevoTransporter = createBrevoTransporter(process.env.BREVO_SMTP_KEY);
            const info = await Promise.race([
                brevoTransporter.sendMail(mailOptions),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Brevo timeout (10s)')), 10000))
            ]);
            console.log(`✅ Confirmation email sent via Brevo to ${leaderEmail}`);
            return info;
        } catch (brevoError) {
            console.error(`⚠️ Brevo failed (${brevoError.message}). Falling back to Gmail...`);
        }
    }

    // Fallback to Gmail
    try {
        console.log("📧 Sending via Gmail SMTP...");
        const info = await Promise.race([
            transporter.sendMail(mailOptions),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Gmail timeout (10s)')), 10000))
        ]);
        console.log(`✅ Confirmation email sent via Gmail to ${leaderEmail}`);
        return info;
    } catch (gmailError) {
        console.error(`❌ Gmail sending failed for ${leaderEmail}:`, gmailError.message);
        throw gmailError;
    }
};

module.exports = { sendConfirmationEmail };
