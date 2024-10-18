import mongoose, { Types } from "mongoose";
import { Chats, Groups } from "../../Models/models.js";
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from '../../utils/ApiResponse.js'
import { userInfo } from "../../constant.js";


export const send = async (req, res) => {
    try {
        //_id : permanent User
        // __id : temp user
        const { _id, identifier, canUpdate, targetedMsgID, msg, replyTo } = req.body;


        if (!(identifier && msg)) {
            return res ? res
                .status(400)
                .json(
                    new ApiError('Group ID & msg required', undefined, false, 400)
                ) : new ApiError('Group ID & msg required', undefined, false, 400)
        }
        const isID = Types.ObjectId.isValid(identifier) ? identifier : 'a3b2c1d4e5f60718293a4b5c';
        const groupFind = await Groups.findOne(
            {
                $or: [{ _id: new Types.ObjectId(isID) }, { groupName: identifier }]
            }
        )
        if (!groupFind) {
            return res ? res
                .status(400)
                .json(
                    new ApiError('Group not found', undefined, false, 400)
                ) : new ApiError('Group not found', undefined, false, 400)
        }

        if (groupFind.isGroupPrivate) {
            let flag = false;
            flag = groupFind.memberLists.some(element => element == _id) ||
                groupFind.TempMembers.some(element => element == _id) ||
                groupFind.permanentMember.some(element => element == _id) ||
                groupFind.admin._id == _id
            if (!flag) {
                return res ? res
                    .status(400)
                    .json(
                        new ApiError('permission denied', undefined, false, 400)
                    ) : new ApiError('permission denied', undefined, false, 400)
            }
        }

        const chat = new Chats({
            msg,
            targetedMsgID,
            canUpdate,
            senderID: mongoose.Types.ObjectId.isValid(_id) ? _id : null,
            TempID: mongoose.Types.ObjectId.isValid(_id) ? null : _id,
            targetedMsgID: replyTo
        });
        const chatDoc = await chat.save();
        const newGroup = await Groups.findOneAndUpdate(
            {
                _id: groupFind._id
            },
            {
                $push: { chatID: chatDoc._id }
            },
            {
                new: true
            }
        )


        let AggregateChat;
        if (chat?.TempID == null) {
            AggregateChat = await Chats.aggregate([
                {
                    $match: {
                        _id: chatDoc._id
                    }
                },
                {
                    $lookup: {
                        from: 'User',
                        localField: 'senderID',
                        foreignField: '_id',
                        as: 'sender',
                        pipeline: [
                            {
                                $project: userInfo
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'Chats',
                        localField: 'targetedMsgID',
                        foreignField: '_id',
                        as: 'replyTo',
                    }
                },
                {
                    $set: {
                        sender: { $arrayElemAt: ["$sender", 0] }
                    }
                },
                {
                    $set: {
                        replyTo: { $arrayElemAt: ["$replyTo", 0] }
                    }
                },
            ])
        } else {
            AggregateChat = await Chats.aggregate([
                {
                    $match: {
                        _id: chatDoc._id
                    }
                },
                {
                    $lookup: {
                        from: 'Chats',
                        localField: 'targetedMsgID',
                        foreignField: '_id',
                        as: 'replyTo',
                    }
                },
                {
                    $set: {
                        sender: { $arrayElemAt: ["$sender", 0] }
                    }
                },
                {
                    $set: {
                        replyTo: { $arrayElemAt: ["$replyTo", 0] }
                    }
                },
            ])
        }

        return res ? res
            .status(200)
            .json(
                new ApiResponse('Msg send', { newGroup }, true, 200)
            ) : new ApiResponse('Msg send', AggregateChat[0], true, 200)
    } catch (error) {
        console.log(error);

        return res ? res
            .status(500)
            .json(
                new ApiError('Server Error', undefined, false, 500)
            ) : new ApiError('Server Error', undefined, false, 500)
    }
}