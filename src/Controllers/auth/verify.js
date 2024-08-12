import { otp, User } from "../../Models/models.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { createToken } from "../../utils/getToken.js";
import 'dotenv/config'

export const verify = async (req, res) => {
    try {
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
            return res
                .status(404)
                .json(
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
            return res
                .cookie(process.env.TokenName, createToken({ _id: user._id, email: user.email }))
                .json(
                    new ApiResponse('User verified')
                )
        } else {
            return res
                .status(404)
                .json(
                    new ApiError('Invalid OTP')
                )
        }
    } catch (error) {
        return res
            .status(500)
            .json(
                new ApiError('Server Error')
            )
    }
}