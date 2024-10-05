import { Types } from "mongoose";
import { Chats, Groups } from "../../Models/models.js";
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from '../../utils/ApiResponse.js'

export const send = async (req, res) => {
    try {
        //_id : permanent User
        // __id : temp user
        const { _id, identifier, canUpdate, targetedMsgID, msg } = req.body;


        if (!(identifier && msg)) {
            return res
                .status(400)
                .json(
                    new ApiError('Group ID & msg required', undefined, false, 400)
                )
        }
        const isID = Types.ObjectId.isValid(identifier) ? identifier : 'a3b2c1d4e5f60718293a4b5c';
        const groupFind = await Groups.findOne(
            {
                $or: [{ _id: new Types.ObjectId(isID) }, { groupName: identifier }]
            }
        )
        if (!groupFind) {
            return res
                .status(400)
                .json(
                    new ApiError('Group not found', undefined, false, 400)
                )
        }
        if (!(groupFind.admin == _id || groupFind.memberLists.includes(_id) || groupFind.permanentMember.includes(_id))) {
            return res
                .status(400)
                .json(
                    new ApiError('Permission Denied', undefined, false, 400)
                )
        }
        const chat = new Chats({
            msg,
            targetedMsgID,
            canUpdate,
            senderID: _id
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

        return res ? res
            .status(200)
            .json(
                new ApiResponse('Msg send', { newGroup }, true, 200)
            ) : new ApiResponse('Msg send',  chatDoc , true, 200)
    } catch (error) {
        console.log(error);

        return res ? res
            .status(500)
            .json(
                new ApiError('Server Error', undefined, false, 500)
            ) : new ApiError('Server Error', undefined, false, 500)
    }
}