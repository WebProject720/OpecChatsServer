import 'dotenv/config'
import { ApiError } from '../../src/utils/ApiError.js'
import { verifyToken } from '../../src/utils/verifyToken.js';


export const auth = async (req, res, next) => {
    try {
        const { user } = req.body || false;
        const { guest } = req.body || false;

        let cookie;
        if (user) {
            cookie = req?.cookies[process.env.TokenName];
        } else if (guest) {
            cookie = req?.cookies[process.env.GuestTokenName];
        } else {
            return res.status(404).json(
                new ApiError('Session not found')
            )
        }


        const userLogged = verifyToken(cookie);


        if (!userLogged) {
            return res.status(404).json(
                new ApiError('Invalid Session ID')
            )
        }

        req.body._id = userLogged?._id || false;
        next();
    } catch (error) {
        return res.status(500).json(
            new ApiError('Server Error', error, false)
        )
    }
}