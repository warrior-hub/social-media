import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true, 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendMail = async (to, otp) => {
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: to,
        subject: "Reset Your Password",
        html: `<p>Your OTP for password reset is <b>${otp}</b>.
        It expires in 5 minutes.</p>`
    });
};

export default sendMail;