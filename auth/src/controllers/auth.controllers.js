import User from "../models/auth.models.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

const registerUser = async (req, res) => {
  const { email, name, password } = req.body;

  if (!name || !email || !password) {
    return res.status(401).json({
      message: "All fields are required",
      success: false,
    });
  }

  try {
    const allreadyRegisteredUser = await User.findOne({ email });

    if (allreadyRegisteredUser) {
      return res.status(400).json({
        message: "User allready Registered",
        success: false,
      });
    }

    const token = crypto.randomBytes(25).toString("hex");

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashPassword,
      emailVerificationToken: token,
      emailVerificationExpiry: Date.now() + 60 * 60 * 1000,
    });

    if (!user) {
      return res.status(400).json({
        message: "User not Registered successfully",
        success: false,
      });
    }

    // sending Email

    const sendingEmail = async () => {
      const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_HOST,
        port: process.env.MAILTRAP_PORT,
        secure: false,
        auth: {
          user: process.env.MAILTRAP_USERNAME,
          pass: process.env.MAILTRAP_PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: process.env.MAILTRAP_FROM,
        to: email,
        subject: "Email Verification",
        text: `${process.env.BASE_URL}/api/v1/users/verify/${token}`,
      });
    };

    await sendingEmail();

    return res.status(201).json({
      message: "User register successfully",
      success: true,
      user: user,
    });
  } catch (error) {
    console.log("Internel server error :- ", error.message);

    return res.status(500).json({
      message: "Internel server error",
      success: false,
      error: error.message,
    });
  }
};

const isVerify = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res.status(404).json({
        message: "Token not found",
        success: false,
      });
    }

    const user = await User.findOne({ emailVerificationToken: token }).select(
      "-password"
    );
    if (user.emailVerificationExpiry < Date.now()) {
      return res.status(400).json({
        message: "Email verification time expires",
        success: false,
      });
    }

    user.isVerified = true;
    user.emailVerificationExpiry = undefined;
    user.emailVerificationToken = undefined;
    await user.save();

    return res.status(200).json({
      message: "Email verification successfully",
      success: true,
      user: user,
    });
  } catch (error) {
    console.log("Internel server error :- ", error.message);

    return res.status(500).json({
      message: "Internel server error",
      success: false,
      error: error.message,
    });
  }
};

export { registerUser, isVerify };
