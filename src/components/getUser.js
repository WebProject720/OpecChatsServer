import { Types } from "mongoose";
import { User } from "../Models/models.js"

export const getUser = async (_id, identifier) => {
    try {

        if (!(_id || identifier)) {
            return false
        }
        const id = Types.ObjectId.isValid(_id) ? _id : 'a3b2c1d4e5f60718293a4b5c';

        const user = await User.aggregate(
            [
                {
                    $match: { $or: [{ email: identifier }, { username: identifier }, { _id: new Types.ObjectId(id) },] }
                },
                {
                    $lookup: {
                        from: 'Groups',
                        localField: '_id',
                        foreignField: 'admin',
                        as: 'adminOfGroups',
                        pipeline: [
                            {
                                $project: {
                                    admin: 0,
                                    activeMemberCount: 0,
                                    currentStatus: 0,
                                    extraMemberAllowed: 0,
                                    isSubscribed: 0,
                                    memberLists: 0,
                                    waitingMember: 0,
                                    removedMembers: 0,
                                    blockedMembers: 0,
                                    uniqueCode: 0,
                                    chatID: 0,
                                    __v: 0
                                }
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'Groups',
                        localField: '_id',
                        foreignField: 'permanentMember',
                        as: 'JoinedGroup1',
                    }
                },
                {
                    $lookup: {
                        from: 'Groups',
                        localField: '_id',
                        foreignField: 'memberLists',
                        as: 'JoinedGroup2',
                    }
                },
                {
                    $project: {
                        // Include all fields from the original document
                        _id: 1,
                        // Add all fields using $mergeObjects to maintain original structure
                        originalFields: '$$ROOT',
                        JoinedGroup: {
                            $setUnion: ['$JoinedGroup1', '$JoinedGroup2']
                        }
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: [
                                '$originalFields',  // Include all original fields
                                { JoinedGroup: '$JoinedGroup' } // Include the combined group members
                            ]
                        }
                    }
                },
                {
                    $project: {
                        password: 0,
                        token: 0,
                        providerIds: 0,
                        JoinedGroup1: 0,
                        JoinedGroup2: 0
                    }
                }
            ]
        )
        //Remove unique code //
        if (!user.length) return false;
        return user[0];
    } catch (error) {
        console.log(error);
        return false
    }
}