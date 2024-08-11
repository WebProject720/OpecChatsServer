import nodemailer from 'nodemailer'
import 'dotenv/config'
import { otp } from '../Models/models.js';

const genOTP = () => {
    return Math.floor(1000 + Math.random() * 9000);
};

export const sendMail = async (tagertEmail) => {
    const OTP = genOTP();

    try {
        const transport = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            service: "gmail",
            secure: true,
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.EMAIL_SENDER_PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_SENDER,
            to: tagertEmail,
            subject: "OpecChats || One Time Password",
            html: `<Html>
                        <Text>Welcome <strong> ${tagertEmail}</strong>,</Text><br/>
                        <Text>Your OTP is: <b> ${OTP}</b></Text><br/>
                        <Text>Please use this OTP to proceed with your action.</Text><br/>
                        <Text>Thank you!</Text>
                    </Html>`,
        };

        const email = await transport.sendMail(mailOptions);
        if (!email) {
            return false
        }
        const del = await otp.deleteOne({ email: tagertEmail });
        const OTPdoc = new otp({
            email: tagertEmail,
            OTP,
        });
        await OTPdoc.save();

        return true
    } catch (error) {
        return false
    }
};