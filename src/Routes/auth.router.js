import { Router } from "express";
import { register } from "../Controllers/auth/register.js";
import { email } from "../Controllers/auth/email.js";
import { login } from "../Controllers/auth/login.js";
import { verify } from "../Controllers/auth/verify.js";
import { checkUsername } from '../Controllers/auth/checkUsername.js'



const authRouter = Router()
authRouter.route('/register').post(register)
authRouter.route('/email').post(email)
authRouter.route('/login').post(login)
authRouter.route('/verify').post(verify)
authRouter.route('/checkUsername').post(checkUsername)

export default authRouter;