import { Router } from "express";
import { register } from "../Controllers/auth/register.js";
import { email } from "../Controllers/auth/email.js";
import { login } from "../Controllers/auth/login.js";
import { verify } from "../Controllers/auth/verify.js";
import { checkUsername } from '../Controllers/auth/checkUsername.js'
import { logout } from "../Controllers/auth/logout.js";
import { auth } from "../middleware/auth.js";
import { GuestLogin } from "../Controllers/auth/guest.js";
import { GuestLogout } from "../Controllers/auth/guestLogout.js";
import { googleLogin } from "../Controllers/auth/googleLogin.js";

const authRouter = Router()

authRouter.route('/register').post(register)
authRouter.route('/email').post(email)
authRouter.route('/login').post(login)
authRouter.route('/verify').post(verify)
authRouter.route('/checkUsername').post(checkUsername)
authRouter.route('/logout').post(auth, logout)

authRouter.route('/google').post(googleLogin)

authRouter.route('/guest').post(GuestLogin)
authRouter.route('/guestLogout').post(auth,GuestLogout)

export default authRouter;