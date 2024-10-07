import { ApiResponse } from "../../utils/ApiResponse.js";
import { createToken } from "../../utils/getToken.js";
import 'dotenv/config'

export const GuestLogin = (req, res) => {
    const { name } = req.body;
    const production = process.env.PRODUCTION == "true";
    const CookieOptions = {
        httpOnly: true,     // Cookie accessible only by web server
        secure: production,       // Cookie sent only over HTTPS
        expires: new Date(Date.now() + 36000000),    // Cookie expiry time in milliseconds
        sameSite: production ? 'none' : 'Lax', // Cookie sent only to the same site
        path: '/',
    }
    const cookie = createToken({ name: name ? name : "guest" });
    return res
        .cookie(process.env.GuestTokenName, cookie, CookieOptions)
        .json(
            new ApiResponse('login successfully', { name: name ? name : "guest"  })
        )
}