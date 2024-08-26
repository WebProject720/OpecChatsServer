import { Types } from "mongoose";
import { User } from "../Models/models.js"

export const getUser = async (_id, identifier) => {
    try {
        if (!(_id || identifier)) {
            return false
        }

        const user = await User.aggregate(
            [
                {
                    $match: { $or: [{ _id: new Types.ObjectId(_id) }, { email: identifier }, { username: identifier }] }
                },
                {
                    $lookup: {
                        from: 'Groups',
                        localField: 'adminOfGroups',
                        foreignField: '_id',
                        as: 'adminOfGroups',
                        pipeline: [
                            {
                                $project: {
                                    admin: 0
                                }
                            }
                        ]
                    }
                },
                {
                    $project: {
                        password: 0
                    }
                }
            ]
        )
        if (!user.length) return false;
        return user[0];
    } catch (error) {
        console.log(error);
        return false
    }
}