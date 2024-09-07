import { Types } from "mongoose";
import { User } from "../Models/models.js"

export const getUser = async (_id, identifier) => {
    try {

        if (!(_id || identifier)) {
            return false
        }
        const id = Types.ObjectId.isValid(_id) ? _id : 'a3b2c1d4e5f60718293a4b5c';
        console.log(_id, identifier);

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
                        as: 'JoinedGroup',
                    }
                },
                {
                    $project: {
                        password: 0,
                        token: 0,
                        providerIds: 0
                    }
                }
            ]
        )
        console.log(user);

        if (!user.length) return false;
        return user[0];
    } catch (error) {
        console.log(error);
        return false
    }
}