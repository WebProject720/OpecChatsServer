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