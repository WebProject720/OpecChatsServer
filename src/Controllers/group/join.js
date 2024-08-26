import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from '../../utils/ApiResponse.js'
import { Groups } from "../../Models/models.js";
import { Types } from "mongoose";

const checkAlready = (group, _id) => {
    if (group.permanentMember.includes(_id)) {
        return new ApiError('User already a Member', undefined, false)
    }
    else if (group.waitingMember.includes(_id)) {
        return new ApiError('User already in Waiting List', undefined, false)
    }
    else if (group.removedMembers.includes(_id)) {
        return new ApiError('User removed by Admin', undefined, false)
    }
    else if (group.blockedMembers.includes(_id)) {
        return new ApiError('User Blocked By Admin', undefined, false)
    }
    else if (group.admin._id == (_id)) {
        return new ApiError('Group Admin Can\'t Join', undefined, false)
    }
    else {
        return 2;
    }
}

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
        const findGroup = await Groups.findOne({
            $or: [{ _id: new Types.ObjectId(isID) }, { groupName: identifier }]
        });
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
            const check = checkAlready(findGroup, _id);
            if (check !== 2) {
                return res.status(400).json(check);
            }

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
        //public group
        const check = checkAlready(findGroup, _id);
        if (check !== 2) {
            return res.status(400).json(check);
        }

        newGroup = await Groups.findOneAndUpdate(
            {
                $or: [{ _id: new Types.ObjectId(isID) }, { groupName: identifier }]
            },
            {
                $push: {
                    permanentMember: _id
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
        console.log(error);

        return res.status(500).json(
            new ApiError('Server Error', error, false)
        )
    }
}