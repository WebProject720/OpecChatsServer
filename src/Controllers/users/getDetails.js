import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from '../../Models/models.js'
import 'dotenv/config'

export const userDetails = async (req, res) => {
    try {
        const { _id, email, username } = req.body;

        if (!(_id || email || username)) {
            return res
                .status(404)
                .json(
                    new ApiError('Identity required')
                )
        }

        const user = await User.findOne({
            $or: [{ email }, { _id }, { username }]
        }).select('-password -token');


        if (!user) {
            return res
                .status(404)
                .json(
                    new ApiError('User not found')
                )
        }

        return res.json(
            new ApiResponse('user details', user, true, 200)
        )
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError('Server Error', error)
            )
    }
}