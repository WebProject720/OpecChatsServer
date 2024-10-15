import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import 'dotenv/config'

export const GuestLogout = async (req, res) => {
    try {
        const { _id } = req.body;
        // if (!_id) {
        //     return res.status(400).json(
        //         new ApiError('Session not found')
        //     )
        // }
        return res
            .status(200)
            .clearCookie(process.env.GuestTokenName)
            .clearCookie(process.env.TokenName)
            .json(
                new ApiResponse('guest user logout')
            )

    } catch (error) {
        return res.status(500).json(
            new ApiError('Server Error')
        )
    }
}