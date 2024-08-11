import { Router } from "express";
import { register } from "../Controllers/auth/register.js";


const authRouter=Router()
authRouter.route('/register').post(register)

export default authRouter;