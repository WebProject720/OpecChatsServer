import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from '../../Models/models.js'
import bcrypt from 'bcrypt'
import { createToken } from "../../utils/getToken.js";
import 'dotenv/config'


export const login = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        if (!((email || username) && password)) {
            return res
                .status(404)
                .json(
                    new ApiError('All fileds required')
                )
        }

        const user = await User.findOne({
            $or: [{ email }, { username }]
        });
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
        return res
            .cookie(process.env.TokenName, token)
            .json(
                new ApiResponse('login successfully', { token })
            )
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError('Server Error', error)
            )
    }

}