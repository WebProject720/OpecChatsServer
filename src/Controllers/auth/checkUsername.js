import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from '../../Models/models.js'
import 'dotenv/config'

export const checkUsername = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) {
            return res
            .status(404)
            .json(new ApiError('Username required'))
        }
        const user =await User.findOne({username});
        if(user){
            return res
            .status(404)
            .json(
                new ApiError('username already exits')
            )
        }
        return res.json(
            new ApiResponse('username is unique')
        )
    } catch (error) {
        return res
        .status(500)
        .json(
            new ApiError('Server Error')
        )
    }
}