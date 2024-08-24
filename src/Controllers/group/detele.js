import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from '../../utils/ApiResponse.js'
import { Groups } from "../../Models/models.js";
import { getUser } from '../../components/getUser.js'


export const deleteGroup = async (req, res) => {

    try {
        const { _id, groupID, groupName } = req.body;
        if (!(groupID || groupName)) {
            return res.status(404).json(
                new ApiError('All fields required', undefined, false)
            )
        }
        const user = await getUser(_id);
        // console.log(user);


        const group = await Groups.deleteOne({ groupName });
        // console.log(group);

        if (group.deletedCount == 1) {
            return res.status(200).json(
                new ApiResponse('Group Deleted', true, true)
            )
        }
        return res.status(404).json(
            new ApiError('group not Found', undefined, false)
        )
    } catch (error) {
        return res.status(500).json(
            new ApiError('Server Error', error, false)
        )
    }
}