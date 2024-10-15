import 'dotenv/config'
import { ApiError } from '../../src/utils/ApiError.js'
import { verifyToken } from '../../src/utils/verifyToken.js';


export const auth = async (req, res, next) => {
    try {
        const cookie = req?.cookies[process.env.TokenName] || req?.cookies[process.env.GuestTokenName];
        console.log(cookie);

        if (!cookie) {
            return res.status(404).json(
                new ApiError('Session not found')
            )
        }
        const user = verifyToken(cookie);


        if (!user) {
            return res.status(404).json(
                new ApiError('Invalid Session ID')
            )
        }

        req.body._id = user?._id || false;
        next();
    } catch (error) {
        return res.status(500).json(
            new ApiError('Server Error', error, false)
        )
    }
}