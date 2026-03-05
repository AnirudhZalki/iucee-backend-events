const { sendConfirmationEmail } = require('./mailService');

async function testService() {
    console.log("🔍 Testing Refactored Mail Service...");
    try {
        const info = await sendConfirmationEmail({
            leaderEmail: process.env.EMAIL_USER, // Send to self for testing
            leaderName: "Test Participant",
            teamName: "Refactor Test Team",
            regId: "SIS-TEST-99"
        });
        console.log("✅ Mail Service verification successful!");
    } catch (error) {
        console.error("❌ Mail Service verification failed:", error.message);
    }
}

testService();
