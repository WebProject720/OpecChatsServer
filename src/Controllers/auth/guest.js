import { ApiResponse } from "../../utils/ApiResponse.js";
import { createToken } from "../../utils/getToken.js";
import 'dotenv/config'
import { v4 } from 'uuid'

export const GuestLogin = (req, res) => {
    const { name } = req.body;
    const production = process.env.PRODUCTION == "true";
    const TokenName = process.env.GuestTokenName||'GuestToken';

    const CookieOptions = {
        httpOnly: true,     // Cookie accessible only by web server
        secure: production,       // Cookie sent only over HTTPS
        expires: new Date(Date.now() + 36000000),    // Cookie expiry time in milliseconds
        sameSite: production ? 'none' : 'Lax', // Cookie sent only to the same site
        path: '/',
    }
    const guest = { _id: v4(), name: name ? name : "guest" }
    const cookie = createToken(guest);
    return res
        .cookie(TokenName, cookie, CookieOptions)
        .json(
            new ApiResponse('login successfully', guest)
        )
}