import mongoose, { Schema } from "mongoose";



const OtpSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: false,
        },
        OTP: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

export const otp = new mongoose.model('otp', OtpSchema);