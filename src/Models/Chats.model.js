import mongoose from "mongoose";


const ChatsSchema = new mongoose.Schema(
  {
    senderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    TempID:{
      type:String,
      default:null
    },
    canUpdate: {
      type: Boolean,
      default: true,
    },
    targetedMsgID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chats',
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

export const Chats = new mongoose.model('Chats', ChatsSchema, 'Chats')