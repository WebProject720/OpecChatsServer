import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from '../../Models/models.js'
import bcrypt from 'bcrypt'
import { createToken } from "../../utils/getToken.js";
import 'dotenv/config'
import { Types } from "mongoose";
import { getUser } from "../../components/getUser.js";


export const login = async (req, res) => {
    const CookieOptions = {
        httpOnly: true,     // Cookie accessible only by web server
        secure: false,       // Cookie sent only over HTTPS
        maxAge: 36000000,    // Cookie expiry time in milliseconds
        // sameSite: 'none', // Cookie sent only to the same site
        path: '/',
    }
    try {
        const { identifier, password } = req.body;
        if (!(identifier && password)) {
            return res
                .status(404)
                .json(
                    new ApiError('All fileds required')
                )
        }
        const _id = identifier.length < 24 ? '66cb64e7ad5783c372a7f00c' : identifier

        const user = await User.findOne(
            {
                $or: [{ email: identifier }, { username: identifier }, { _id: new Types.ObjectId(_id) }]
            }
        )
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
        const fullUser = await getUser(identifier);
        return res
            .cookie(process.env.TokenName, token, CookieOptions)
            .json(
                new ApiResponse('login successfully', { token, user:fullUser })
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