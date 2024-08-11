import mongoose, { Schema } from "mongoose";


const ChatsSchema = new Schema(
  {
    senderID: {
      type:Schema.Types.ObjectId,
      ref:"Members"
    },
    canUpdate: {
      type: Boolean,
      default: true,
    },
    targetedMsgID: {
      default: null,
    },
    msg: {
      type: String,
      required: true,
    },
    MsgBeforeUpdate: {
      type: String,
      default: null,
    },
    isRemoved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Chats =new mongoose.model('Chats',ChatsSchema,'Chats')