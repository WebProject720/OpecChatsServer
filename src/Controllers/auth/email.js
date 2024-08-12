import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { sendMail } from "../../utils/email.js";


export const email = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res
                .status(404)
                .json(new ApiError('email required'));
        }

        const response = await sendMail(email);
        if (!response) {
            return res
                .status(404)
                .json(new ApiError('Try again', {}, false, 500));
        }
        return res.json(
            new ApiResponse('Email send Successfully', email)
        )
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError('Server Error', error)
            )
    }
}