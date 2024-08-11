import { Router } from "express";
import { register } from "../Controllers/auth/register.js";
import { email } from "../Controllers/auth/email.js";


const authRouter=Router()
authRouter.route('/register').post(register)
authRouter.route('/email').post(email)

export default authRouter;