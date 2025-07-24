import twilio from 'twilio'

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export const sendOtpViaSMS = async (phone, otp) => {
    try {
        const mes = await client.messages.create({
            body: `Your Registration Otp is ${otp}`,
            from: process.env.TWILIO_PHONE,
            to: phone,
        });

        console.log("Twilio Message:", mes); // ✅ FIXED
    } catch (err) {
        console.error("Twilio Error:", err);
    }
}