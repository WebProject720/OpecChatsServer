import { Types } from "mongoose";
import { Groups } from "../Models/models.js";



export const getGroup = async (groupID, identifier) => {

    const userInfo = {
        _id: 1,
        username: 1,
        email: 1,
        profileImage:1
    }

    try {
        if (!(groupID || identifier)) {
            return false;
        }
        const group = await Groups.aggregate(
            [
                {
                    $match: {
                        $or: [{ _id: new Types.ObjectId(groupID) }, { groupName: identifier }]
                    }
                },
                {
                    $lookup: {
                        from: 'User',
                        localField: 'admin',
                        foreignField: '_id',
                        as: 'admin',
                        pipeline: [
                            {
                                $project:  userInfo
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'User',
                        localField: 'permanentMember',
                        foreignField: '_id',
                        as: 'permanentMember',
                        pipeline: [
                            {
                                $project:  userInfo
                                
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'User',
                        localField: 'waitingMember',
                        foreignField: '_id',
                        as: 'waitingMember',
                        pipeline: [
                            {
                                $project:  userInfo
                                
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'Members',
                        localField: 'memberLists',
                        foreignField: '_id',
                        as: 'memberLists',
                        pipeline: [
                            {
                                $project:  userInfo
                                
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'User',
                        localField: 'removedMembers',
                        foreignField: '_id',
                        as: 'removedMembers',
                        pipeline: [
                            {
                                $project:  userInfo
                                
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'User',
                        localField: 'blockedMembers',
                        foreignField: '_id',
                        as: 'blockedMembers',
                        pipeline: [
                            {
                                $project:  userInfo
                            }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: 'Chats',
                        localField: 'chatID',
                        foreignField: '_id',
                        as: 'chatID',
                        pipeline: [
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
                                $set: {
                                    sender: { $arrayElemAt: ["$sender", 0] }
                                }
                            }
                        ]
                    }
                },
                {
                    $project:{
                        uniqueCode:0
                    }
                },
                {
                    $set: {
                        admin: { $arrayElemAt: ["$admin", 0] }
                    }
                }
            ])
        if (!group?.length) return false
        return group[0];
    } catch (error) {
        console.log(error);
        return false
    }
}