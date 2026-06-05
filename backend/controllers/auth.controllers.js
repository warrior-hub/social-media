import sendMail from "../config/mail.js";
import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
export const signUp = async (req, res) => {
    try {
        const { name, email, password, userName } = req.body;
        const findByEmail = await User.findOne({ email });
        if (findByEmail) {
            return res.status(400).json({ message: "Email already exits!" })
        }
        const findByUserName = await User.findOne({ userName });
        if (findByUserName) {
            return res.status(400).json({ message: "Username already exits!" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atlest 6 characters" })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            userName,
            email,
            password: hashPassword
        })

        const token = genToken(user._id);
        res.cookie("token", token, {
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none"
        });

        return res.status(201).json({ message: "Sign up succuss", user });

    } catch (error) {
        return res.status(500).json({ message: `Signup error ${error}` })
    }
}

export const signIn = async (req, res) => {
    try {
        const { password, userName } = req.body;
        const user = await User.findOne({ userName }).populate("posts reels");
        if (!user) {
            return res.status(400).json({ message: "User not found!" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect passowrd!" })
        }

        const token = await genToken(user._id);
        res.cookie("token", token, {
            maxAge: 10 * 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "none",
            secure: true
        });

        return res.status(200).json({ message: 'Login successfully', token, user });

    } catch (error) {
        return res.status(500).json({ message: `SignIn error ${error}` })
    }
}

export const signOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Sign out successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Sign out error ${error}` });
    }
};

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(email);

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User not found!" })
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        user.resetOtp = otp
        user.otpExpires = Date.now() + 5 * 60 * 1000;
        await user.save()

        sendMail(email, otp)
        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Send otp error ${error}` })
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log(email, otp);

        const user = await User.findOne({ email })
        if (!user || user.resetOtp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: "invalid/expired otp" })
        }

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "10m" });

        user.resetOtp = undefined
        user.otpExpires = undefined
        await user.save();

        return res.status(200).json({ message: "OTP verified", token })

    } catch (error) {
        return res.status(500).json({ message: `Verify otp error ${error}` })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { newPassword, ConfirmNewPassword, resetToken } = req.body;
        if (newPassword !== ConfirmNewPassword) {
            return res.status(400).json({ message: "Password dose not match" })
        }
        const decode = jwt.verify(resetToken, process.env.JWT_SECRET)
        const email = decode.email;
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        const hashpassword = await bcrypt.hash(newPassword, 10);
        user.password = hashpassword
        await user.save()
        return res.status(200).json({ message: "Password reset successfully" })

    } catch (error) {
        return res.status(500).json({ message: `Reset passowrd error ${error}` })
    }
}
