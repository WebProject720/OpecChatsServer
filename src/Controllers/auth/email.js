import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { sendMail } from "../../utils/email.js";


export const email = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json(new ApiError('email required'));
    }

    const response = await sendMail(email);
    if (!response) {
        return res.json(new ApiError('Try again', {}, false, 500));
    }
    return res.json(
        new ApiResponse('Email send Successfully', email)
    )
}