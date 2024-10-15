import mongoose, { Types } from "mongoose";
import { Chats, Groups } from "../../Models/models.js";
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from '../../utils/ApiResponse.js'
import { userInfo } from "../../constant.js";

export const deleteChat = async (req, res) => {
    try {
        const { _id, identifier } = req?.body || req;
        if (!_id) {
            return res ?
                res
                    .status(404)
                    .json(
                        new ApiError('please login !!', {}, false)
                    ) :
                new ApiError('please login!!', {}, false)

        }
        if (!identifier) {
            return res ?
                res
                    .status(404)
                    .json(
                        new ApiError('Chat ID not found', {}, false)
                    ) :
                new ApiError('Chat ID not found', {}, false)
        }
        //check  : user or guest
        //get chat if chat id available
        const chatDoc = await Chats.findOne({
            _id: identifier
        })

        if (chatDoc?.senderID != _id && chatDoc?.TempID != _id) {
            return res ?
                res
                    .status(404)
                    .json(
                        new ApiError('Access denied', {}, false)
                    ) :
                new ApiError('Access denied', {}, false)
        }
        const { deletedCount } = await Chats.deleteOne({
            _id: identifier
        })

        if (deletedCount <= 0) {
            return res ?
                res
                    .status(404)
                    .json(
                        new ApiError('Not Delete', {}, false)
                    ) :
                new ApiError('Not Delete', {}, false)
        }


        return res ? res.status(200).json(
            new ApiResponse('chat deleted !!', { deleted: true,id:identifier }, true)
        ) : new ApiResponse('chat deleted !!', { deleted: true,id:identifier }, true)


    } catch (error) {
        return res ?
            res
                .status(500)
                .json(
                    new ApiError('Server ERROR', { error }, false)
                ) :
            new ApiError('Server Error', { error }, false)
    }
}