import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from '../../Models/models.js'
import bcrypt from 'bcrypt'
import { createToken } from "../../utils/getToken.js";
import 'dotenv/config'
import { Types } from "mongoose";
import { getUser } from "../../components/getUser.js";
import { CookieOption } from "../../utils/cookieOptions.js";


export const login = async (req, res) => {
    const production = process.env.PRODUCTION == "true";
    const CookieOptions = CookieOption(production);

    try {
        let { identifier, password } = req.body;
        identifier = identifier?.trim()
        const TokenName = process.env.TokenName || 'Token';
        const cookie = req?.cookies[TokenName];

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
                $or: [{ email: identifier.toLowerCase() }, { username: identifier }, { _id: new Types.ObjectId(validID) }]
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
            .cookie(TokenName, token, CookieOptions)
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