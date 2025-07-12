import User from "../models/auth.models.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

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

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "All fields are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email & password",
        success: false,
      });
    }

    const jwtToken = jwt.sign(
      {
        email: user.email,
        _id: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    console.log(`JWT token :- ${jwtToken}`);

    const cookieOption = {
      httpOnly: true,
      expires: new Date(Date.now() + 12 * 60 * 60 * 1000),
    };

    res.cookie("token", jwtToken, cookieOption);

    return res.status(200).json({
      message: "User login successfully",
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

const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.user.email,
      _id: req.user._id,
    }).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not loggedIn",
        success: false,
      });
    }

    return res.status(200).json({
      message: "get profile successfully",
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

const userLogout = async (req, res) => {
  try {
    res.status(200).cookie("token", "").json({
      message: "User logout successfully",
      success: true,
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "This user not register",
        success: false,
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

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
        subject: "Reset Password",
        text: `${process.env.BASE_URL}/api/v1/users/reset-password/${token}`,
      });
    };

    await sendingEmail();

    res.status(200).json({
      message: "Forgot password successfully",
      success: true,
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

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;

    const { token } = req.params;

    if (!password || !token) {
      return res.status(400).json({
        message: "Password & token are required",
        success: false,
      });
    }

    const user = await User.findOne({ resetPasswordToken: token });

    if (!user) {
      return res.status(400).json({
        message: "This user not register",
        success: false,
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    user.password = hashPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    res.status(200).json({
      message: "Reset password successfully",
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

export {
  registerUser,
  isVerify,
  loginUser,
  getProfile,
  userLogout,
  resetPassword,
  forgotPassword,
};
