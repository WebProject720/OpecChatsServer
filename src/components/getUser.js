import { Types } from "mongoose";
import { User } from "../Models/models.js"


export const getUser = async (_id) => {
    if (!_id) {
        return false
    }

    const user = await User.aggregate(
        [
            {
                $match: { _id: new Types.ObjectId(_id) }
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

    return user;
}