import { model, Schema } from "mongoose";
import { AvilableUserRoles, UserRoleEnum } from "../utils/constents.js";

const userSchema = new Schema(
  {
    avatar: {
      type: {
        url: String,
        localpath: String,
      },
      default: {
        url: "https://placehold.co/600x400/orange/white",
        localpath: "",
      },
    },

    fullname: {
      type: String,
      trim: true,
      required: true,
    },

    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: AvilableUserRoles,
      default: UserRoleEnum.USER,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: String,

    verificationExpiry: Date,

    resetVerificationToken: String,

    resetVerificationExpiry: Date,
  },
  { timestamps: true }
);









const User = model("User", userSchema);

export default User;
