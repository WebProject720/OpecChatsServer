import mongoose, { Schema } from "mongoose";


export const GroupSchema= new Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: false,
    },
    bgImage: {
      type: String,
      required: false,
    },
    isGroupPrivate: {
      type: Boolean,
      default: false,
    },
    memberAllowedAtSingleTime: {
      type: Number,
      default: 20,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    activeMemberCount: {
      type: Number,
      default: 0,
    },
    currentStatus: {
      type: Boolean,
      default: true,
    },
    chatID: {
      type: Schema.Types.ObjectId,
      ref: "ChatHistory",
    },
    extraMemberAllowed: { type: Number, default: 0 },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    memberLists: {
      type: [Schema.Types.ObjectId],
      ref: "Members",
    },
    waitingMember: {
      type: [Schema.Types.ObjectId],
      ref: "Members",
    },
    removedMembers: {
      type: [Schema.Types.ObjectId],
      ref: "Members",
    },
    blockedMembers: {
      type: [Schema.Types.ObjectId],
      ref: "Members",
    },
    uniqueCode: {
      type: String,
      required: false,
      default: null,
    },
  },
  { timestamps: true }
);

export const Groups =new mongoose.model('Groups',GroupSchema,'Groups')