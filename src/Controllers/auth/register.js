import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import { User } from '../../Models/models.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


export const register = async (req, res) => {
    const { email, username, password } = req.body;

    if (!(email && username && password)) {
        return res.json(new ApiError('All fields Required'));
    }

    console.log(req.body);


    return res.json(new ApiResponse('Success', req.body))
}