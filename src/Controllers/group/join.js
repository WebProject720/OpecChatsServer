import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from '../../utils/ApiResponse.js'
import { Groups } from "../../Models/models.js";
import { Types } from "mongoose";
import { getGroup } from "../../components/getGroup.js";


export const join = async (req, res) => {
    try {
        const { _id, identifier } = req.body;
        if (!(_id && identifier)) {
            return res
                .status(400)
                .json(
                    new ApiError('User & Group Details required', undefined, false)
                )
        }
        const isID = Types.ObjectId.isValid(identifier) ? identifier : 'a3b2c1d4e5f60718293a4b5c';
        const findGroup = await getGroup(isID, identifier);
        if (!findGroup) {
            return res
                .status(404)
                .json(
                    new ApiError('Group not found', undefined, false)
                )
        }
        let newGroup = {};
        //private group
        if (findGroup.isGroupPrivate) {
            newGroup = await Groups.findOneAndUpdate(
                {
                    $or: [{ _id: new Types.ObjectId(isID) }, { groupName: identifier }]
                },
                {
                    $push: {
                        waitingMember: _id
                    }
                },
                {
                    new: true
                }
            )
            return res
                .status(200)
                .json(
                    new ApiResponse('Request To Join Group', newGroup, true)
                )
        }
        newGroup = await Groups.findOneAndUpdate(
            {
                $or: [{ _id: new Types.ObjectId(isID) }, { groupName: identifier }]
            },
            {
                $push: {
                    memberLists: _id
                }
            },
            {
                new: true
            }
        )
        return res
            .status(200)
            .json(
                new ApiResponse('Group Joined', newGroup, true)
            )
    } catch (error) {
        return res.status(500).json(
            new ApiError('Server Error', error, false)
        )
    }
}