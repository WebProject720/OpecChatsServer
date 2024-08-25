import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from '../../utils/ApiResponse.js'
import { Groups, User } from "../../Models/models.js";


export const deleteGroup = async (req, res) => {
    try {
        const { _id, groupID } = req.body;
        if (!(groupID)) {
            return res.status(404).json(
                new ApiError('All fields required', undefined, false)
            )
        }
        const user = await User.updateOne(
            {
                adminOfGroups: { $elemMatch: { $eq: groupID } }
            },
            {
                $pull: {
                    adminOfGroups: groupID
                },
                $inc: { adminOfGroupsCount: -1 }
            },
            {
                new: true
            }
        )

        if (!user?.modifiedCount) {
            return res.status(404).json(
                new ApiError('group not Found in User', undefined, false)
            )
        }


        const group = await Groups.deleteOne({ _id: groupID });

        if (group.deletedCount == 1) {
            return res.status(200).json(
                new ApiResponse('Group Deleted', true, true)
            )
        }
        return res.status(404).json(
            new ApiError('group not Found', undefined, false)
        )
    } catch (error) {
        console.log(error);

        return res.status(500).json(
            new ApiError('Server Error', error, false)
        )
    }
}