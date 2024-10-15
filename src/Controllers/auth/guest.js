import { ApiResponse } from "../../utils/ApiResponse.js";
import { CookieOption } from "../../utils/cookieOptions.js";
import { createToken } from "../../utils/getToken.js";
import 'dotenv/config'
import { v4 } from 'uuid'

export const GuestLogin = (req, res) => {
    const { name } = req.body;
    const TokenName = process.env.GuestTokenName||'GuestToken';
    
    const production = process.env.PRODUCTION == "true";
    const CookieOptions = CookieOption(production)
    
    const guest = { _id: v4(), name: name ? name : "guest" }
    const cookie = createToken(guest);
    return res
        .cookie(TokenName, cookie, CookieOptions)
        .json(
            new ApiResponse('login successfully', guest)
        )
}