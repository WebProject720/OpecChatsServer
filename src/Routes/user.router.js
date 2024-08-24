import { Router } from "express";
import { userDetails } from "../Controllers/users/getDetails.js";
import { currentuser } from "../Controllers/users/currentUser.js";
import { auth } from "../middleware/auth.js";


const UserRouter = Router()
UserRouter.route('/userDetails').post(userDetails);
UserRouter.route('/currentUser').post(auth,currentuser);









export default UserRouter;