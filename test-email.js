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

async function testConnection() {
    console.log("🔍 Checking SMTP Configuration...");
    console.log(`- User: ${process.env.EMAIL_USER}`);
    console.log(`- Pass: ${process.env.EMAIL_PASS ? "****" : "MISSING"}`);

    try {
        await transporter.verify();
        console.log("✅ SMTP Connection Successful!");

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "SMTP Diagnostic Test",
            text: "If you see this, your email connectivity is working perfectly.",
            html: "<h1>✅ Success!</h1><p>Your SMTP connectivity is working perfectly.</p>"
        });

        console.log("✅ Test email sent successfully!");
        console.log("Message ID:", info.messageId);
    } catch (error) {
        console.error("❌ SMTP Error:", error.message);
        if (error.code === 'EAUTH') {
            console.error("⚠️ Authentication Failed. Ensure you are using a 'Gmail App Password', not your regular password.");
        }
    }
}

testConnection();
