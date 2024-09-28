import mongoose, { Schema } from "mongoose";


export const GroupSchema = new Schema(
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
      type: [Schema.Types.ObjectId],
      ref: "Chats",
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
    permanentMember: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    waitingMember: {
      type: [Schema.Types.ObjectId],
      ref: "User",
    },
    removedMembers: {
      type: [Schema.Types.ObjectId],
      ref: "User",
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

// GroupSchema.post('save', async (e, next) => {
//   await User.findOneAndUpdate(
//     { _id: e.admin },
//     {
//       $push: { adminOfGroups: e._id },
//       $inc: { adminOfGroupsCount: 1 }
//     }, {
//     new: true
//   })
//   next();
// })


export const Groups = new mongoose.model('Groups', GroupSchema, 'Groups')