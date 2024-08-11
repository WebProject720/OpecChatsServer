import { otp, User } from "../../Models/models.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";


export const verify = async (req, res) => {
    const { email, username, OTP } = req.body;
    if (!OTP) {
        return res.json(
            new ApiResponse('OTP required')
        )
    }
    if (!(email || username)) {
        return res.json(
            new ApiResponse('Identity required')
        )
    }
    const doc = await otp.findOne({
        $or: [{ email }, { username }]
    });
    if (!doc) {
        return res.json(
            new ApiError('OTP expired')
        )
    }

    if (OTP == doc.OTP) {
        const user = await User.findOneAndUpdate({
            $or: [{ email }, { username }]
        }, { isEmailVerified: true });

        if (!user) {
            return res.json(
                new ApiResponse('User not Verified')
            )
        }
        await otp.deleteOne({ _id: doc._id });
        return res.json(
            new ApiResponse('User verified')
        )
    } else {
        return res.json(
            new ApiResponse('Invalid OTP')
        )
    }


}