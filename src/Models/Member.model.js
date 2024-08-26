import mongoose, { Schema } from "mongoose";


const MembersSchema = new Schema(
    {
        isShowDetailes: {
            type: Boolean,
            default: false,
        },
        username: {
            type: String,
            required: false,
        },
        isActive: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);
export const Members = new mongoose.model('Members', MembersSchema, 'Members')
