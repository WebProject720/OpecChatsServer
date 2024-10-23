import 'dotenv/config'
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';
import { Groups } from '../../Models/group.model.js';
import { Mongoose, ObjectId, Types } from 'mongoose';
import { User } from '../../Models/User.model.js';
import { getGroup } from '../../components/getGroup.js'
import { getBasicGroup } from '../../components/basicGroupD.js';


export const JoinPrivateChat = async (req, res) => {
    try {
        let { _id, code, identifier } = req.body;
        identifier = identifier?.trim();


        if (!code || !identifier) {
            return res
                .status(404)
                .json(
                    new ApiError('Code & Identifier must required', undefined, false)
                )
        }

        const groupID = Types.ObjectId.isValid(identifier) ? identifier : 'a3b2c1d4e5f60718293a4b5c';
        let group = await getBasicGroup(groupID, identifier);

        if (!group) {
            return res
                .status(404)
                .json(
                    new ApiError('Group Not Found', { canAccess: false }, false)
                )
        }

        if (!group?.isGroupPrivate) {
            return res
                .status(404)
                .json(
                    new ApiError('Public Group', undefined, false)
                )
        }


        //check user is already in or not
        let flag = false;
        if (group?.isGroupPrivate) {
            flag = group.memberLists.some(element => element == _id) ||
                group?.TempMembers?.some(element => element == _id) ||
                group.permanentMember.some(element => element == _id) ||
                group?.admin?._id == _id

            if (flag) {
                return res
                    .status(404)
                    .json(
                        new ApiError('User Already a Member', { canAccess: true }, false)
                    )
            }
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
                const groupUpdated = await getGroup(group._id, null)
                return res
                    .status(200)
                    .json(
                        new ApiResponse('User Added To group', groupUpdated, true)
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