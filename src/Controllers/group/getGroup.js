import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from '../../utils/ApiResponse.js'
import { getGroup } from "../../components/getGroup.js";

export const getGroupDetails = async (req, res) => {
    try {
        const { _id, groupID, identifier } = req.body;

        if (!(groupID || identifier)) {
            return res.status(400).json(
                new ApiError('Group details must required', undefined, false)
            )
        }
        const group = await getGroup(groupID, identifier)

        if (!group) {
            return res.status(404).json(
                new ApiError(
                    'Group not found',
                    undefined,
                    false
                )
            )
        }
        return res.status(200).json(
            new ApiResponse('Group Data', group, true)
        )
    } catch (error) {
        console.log(error);

        return res.status(500).json(
            new ApiError(
                'Server Error',
                error,
                false
            )
        )
    }
}