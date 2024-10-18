import { v2 as cloudinary } from "cloudinary"
import { ApiError } from "./ApiError.js"
import { ApiResponse } from "./ApiResponse.js"
import fs from 'fs'
import 'dotenv/config'




export const uploadImage = async (req, res) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDNARY_NAME,
        api_key: process.env.API_CLOUDNARY_KEY,
        api_secret: process.env.API_CLOUDNARY_PASSWORD
    });
    try {
        if (!req?.file) {
            return res.status(404).json(
                new ApiError('Image required', undefined, false)
            )
        }
        const response = await cloudinary.uploader.upload(req?.file?.path, {
            resource_type: "auto"
        })

        fs.unlinkSync(req?.file?.path);

        return res.status(200).json(
            new ApiResponse('Image uploaded', response.secure_url, true)
        )

    } catch (error) {
        fs.unlinkSync(req?.file?.path);
        return res.status(500).json(
            new ApiError('Something eroor', error, false)
        )
    }
}