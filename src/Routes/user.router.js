import { Router } from "express";
import { userDetails } from "../Controllers/users/getDetails.js";


const UserRouter = Router()
UserRouter.route('/userDetails').post(userDetails);









export default UserRouter;