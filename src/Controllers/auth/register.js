import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from '../../Models/models.js'
import bcrypt from 'bcrypt'
import { sendMail } from "../../utils/email.js";
import 'dotenv/config'

export const register = async (req, res) => {
    try {
        const { email, username, password,_id } = req.body;
        if(_id){
            return res
                .status(400)
                .json(
                    new ApiError('Please Logout First')
                )
        }
        if (!(email && username && password)) {
            return res
                .status(404)
                .json(new ApiError('All fields Required'));
        }

        const existUserEmail = await User.findOne({ email });
        if (existUserEmail) {
            return res
                .status(404)
                .json(new ApiError('email already in use'))
        }

        const exitUserUsername = await User.findOne({ username });
        if (exitUserUsername) {
            return res
                .status(404)
                .json(new ApiError('Username already in use'))
        }
        const encodePass = await bcrypt.hash(password, 10);
        const newUser = await User({
            username,
            email,
            password: encodePass
        })

        const response = await newUser.save();
        if (response) {
            const emailSend = await sendMail(email);
            if (!emailSend) {
                return res
                    .status(404)
                    .json(new ApiError('email not send'));
            }
        } else {
            return res
                .status(404)
                .json(new ApiError('Try again'));
        }


        return res
            .status(200)
            .json(new ApiResponse('user created successfully'))
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError('Server Error', error)
            )
    }
}