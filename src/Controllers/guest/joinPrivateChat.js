import 'dotenv/config'
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { Groups } from '../../Models/group.model.js';
import { Types } from 'mongoose';
import { User } from '../../Models/User.model.js';


export const JoinPrivateChat = async (req, res) => {
    try {
        const { _id, code, identifier } = req.body;


        if (!code || !identifier) {
            return res
                .status(404)
                .json(
                    new ApiError('Code & Identifier must required', undefined, false)
                )
        }

        const groupID = Types.ObjectId.isValid(identifier) ? identifier : 'a3b2c1d4e5f60718293a4b5c';
        let group = await Groups.aggregate(
            [
                {
                    $match: {
                        $or: [{ _id: new Types.ObjectId(groupID) }, { groupName: identifier }]
                    }
                },
                {
                    $project: {
                        uniqueCode: 1,
                        groupName: 1,
                        isGroupPrivate: 1,
                        TempMembers: 1,
                        permanentMember: 1,
                        memberLists: 1,
                        admin:1
                    }
                }
            ]
        );
        group = group[0]

        if (!group.isGroupPrivate) {
            return res
                .status(404)
                .json(
                    new ApiError('Public Group', undefined, false)
                )
        }


        //check user is already in or not
        let flag = false;
        if (group?.isGroupPrivate) {
            flag = group.memberLists.some(element => element === _id) ||
                group.TempMembers.some(element => element === _id) ||
                group.permanentMember.some(element => element === _id) ||
                group?.admin?._id == _id
        }

        if (flag) {
            return res
                .status(404)
                .json(
                    new ApiError('User Already a Member', { canAccess: true }, false)
                )
        }



        if (code != group.uniqueCode) {
            return res
                .status(404)
                .json(
                    new ApiError('Invalid Code ', undefined, false)
                )
        }

        if (!Types.ObjectId.isValid(_id)) {
            //Add guest Temp ID to TempIDs in group
            const updatedGroup = await Groups.updateOne(
                {
                    _id: group._id
                },
                {
                    $push: {
                        TempMembers: _id
                    }
                },
                {
                    new: true
                }
            )
            if (updatedGroup) {
                return res
                    .status(200)
                    .json(
                        new ApiResponse('Guest User Added To group', updatedGroup, true)
                    )
            }
        } else {
            const user = await User.findOne({ _id: _id });
            if (!user) {
                return res
                    .status(500)
                    .json(
                        new ApiResponse('User not found', {}, false)
                    )
            }
            const updatedGroup = await Groups.updateOne(
                {
                    _id: group._id
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
            if (updatedGroup) {
                return res
                    .status(200)
                    .json(
                        new ApiResponse('User Added To group', updatedGroup, true)
                    )
            }
        }

    } catch (error) {
        console.log(error);

        return res
            .status(500)
            .json(
                new ApiError('Internal Server Error', undefined, false)
            )
    }
}