import mongoose, { Schema } from "mongoose";



const NotificationsSchema = new Schema(
  {
    sendBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    sendTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    msg: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Notifications =new mongoose.model('Notifications',NotificationsSchema,'Notifications')