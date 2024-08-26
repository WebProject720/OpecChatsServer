import mongoose, { Schema } from "mongoose";



//Schema for type Safety and document follow this scehma
export const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: false,
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            match: [/.+\@.+..+/, "Please provide a valid email address"],
        },
        password: {
            type: String,
            required: [true, "Password are required"],
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        groupAllowed: {
            type: Number,
            default: 3,
        },
        extraGroupAllowed: {
            type: Number,
            default: 0,
        },
        isSubscribed: {
            type: Boolean,
            default: false,
        },
        currentStatus: {
            type: Boolean,
            default: true,
        },
        notifications: {
            type: [Schema.Types.ObjectId],
            ref: "Notification",
        },
        profileImage: {
            type: String,
            default: null,
        },
        token: {
            type: String,
            default: null,
        },
        isPrivateProfile: {
            type: Boolean,
            default: false,
        },
        requestedForGroups: {
            type: [Schema.Types.ObjectId],
            ref: "Groups",
        },
        providerIds: {
            type: [String],
            required: false,
        },
    },
    {
        timestamps: true,
    }
);


export const User = new mongoose.model('User', UserSchema, 'User')