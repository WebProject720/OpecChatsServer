import { getUser } from "../../components/getUser.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

export const currentuser = async (req, res) => {
    const { _id } = req.body;

    if (!_id) {
        return res.status(400).json(
            new ApiError('User not found', undefined, false)
        )
    }
    const user = await getUser(_id);
    if (!user) {
        return res.status(400).json(
            new ApiError('User not found', undefined, false)
        )
    }
    return res.status(200).json(
        new ApiResponse('Logged User', { user }, true)
    )
}