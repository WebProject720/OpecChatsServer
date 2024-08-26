import { Types } from "mongoose";
import { Groups } from "../Models/models.js";



export const getGroup = async (groupID, identifier) => {
    try {
        if (!(groupID || identifier)) {
            return false
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
                                $project: {
                                    _id: 1,
                                    username: 1,
                                    email: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $set: {
                        admin: { $arrayElemAt: ["$admin", 0] }
                    }
                }
            ]
        )
        if (!group?.length) return false
        return group[0];
    } catch (error) {
        console.log(error);
        return false
    }
}