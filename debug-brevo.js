const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const testConfigs = [
    {
        name: "Brevo Port 587 (STARTTLS)",
        host: "smtp-relay.brevo.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.BREVO_SMTP_KEY
        }
    },
    {
        name: "Brevo Port 465 (SSL)",
        host: "smtp-relay.brevo.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.BREVO_SMTP_KEY
        }
    }
];

async function runTests() {
    for (const config of testConfigs) {
        console.log(`\n--- Testing: ${config.name} ---`);
        const transporter = nodemailer.createTransport(config);
        try {
            await transporter.verify();
            console.log(`✅ ${config.name} connected successfully!`);

            await transporter.sendMail({
                from: `IUCEE Team <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_USER,
                subject: "Brevo SMTP Test",
                text: "Testing Brevo SMTP connectivity"
            });
            console.log(`✅ ${config.name} sent email successfully!`);
            break; // Stop if one works
        } catch (error) {
            console.error(`❌ ${config.name} failed:`, error.message);
        }
    }
}

runTests();
