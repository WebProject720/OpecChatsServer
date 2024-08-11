import mongoose, { Schema } from "mongoose";



const ChatsHistorySchema = new Schema(
  {
    admin: {
      type: String,
      required: true,
    },
    currentStatus: {
      type: Boolean,
      default: true,
    },
    chatIDs: {
      type:Schema.Types.ObjectId,
      ref:"Chats"
    }
  },
  { timestamps: true }
);

export const ChatsHistory=new mongoose.model('ChatHistory',ChatsHistorySchema,'ChatHistory')