import mongoose, { Schema } from "mongoose";


const MembersSchema = new Schema(
    {
        isShowDetailes: {
            type: Boolean,
            default: false,
        },
        userID: {
            type: Schema.Types.ObjectId,
            ref: "User"
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
