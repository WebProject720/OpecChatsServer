import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import 'dotenv/config'
import { CookieOption } from "../../utils/cookieOptions.js";


export const logout = async (req, res) => {
    try {
        const { _id } = req.body;
        const production = process.env.PRODUCTION == "true";
        const CookieOptions = CookieOption(production, true)
        if (!_id) {
            return res.status(400).json(
                new ApiError('Session not found')
            )
        }
        return res
            .status(200)
            .clearCookie(process.env.TokenName, CookieOptions)
            .json(
                new ApiResponse('user logout')
            )

    } catch (error) {
        return res.status(500).json(
            new ApiError('Server Error')
        )
    }
}