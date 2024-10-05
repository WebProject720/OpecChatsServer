import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from '../../Models/models.js'
import bcrypt from 'bcrypt'
import { createToken } from "../../utils/getToken.js";
import 'dotenv/config'
import { Types } from "mongoose";
import { getUser } from "../../components/getUser.js";


export const login = async (req, res) => {
    const production = process.env.PRODUCTION;
    const CookieOptions = {
        httpOnly: true,     // Cookie accessible only by web server
        secure: production,       // Cookie sent only over HTTPS
        expires: new Date(Date.now() + 36000000),    // Cookie expiry time in milliseconds
        sameSite: production ? 'none' : 'Lax', // Cookie sent only to the same site
        path: '/',
    }

    try {
        const { identifier, password } = req.body;
        const cookie = req?.cookies[process.env.TokenName];

        if (cookie) {
            return res.status(404).json(
                new ApiError('Session already running')
            )
        }

        if (!(identifier && password)) {
            return res
                .status(404)
                .json(
                    new ApiError('All fileds required')
                )
        }
        const validID = Types.ObjectId.isValid(identifier) ? identifier : 'a3b2c1d4e5f60718293a4b5c';

        const user = await User.findOne(
            {
                $or: [{ email: identifier }, { username: identifier }, { _id: new Types.ObjectId(validID) }]
            }
        ).select('password')

        if (!user) {
            return res
                .status(404)
                .json(
                    new ApiError('user not found')
                )
        }

        const compare = await bcrypt.compare(password, user.password);
        if (!compare) {
            return res
                .status(404)
                .json(
                    new ApiError('Invalid password')
                )
        }
        const token = createToken({ _id: user._id, email: user.email });
        const fullUser = await getUser(validID, identifier);
        return res
            .cookie(process.env.TokenName, token, CookieOptions)
            .json(
                new ApiResponse('login successfully', { token, user: fullUser })
            )
    } catch (error) {
        console.log(error);

        return res
            .status(500)
            .json(
                new ApiError('Server Error', { error }, false, 500)
            )
    }

}