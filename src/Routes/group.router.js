import { Router } from "express";
import { createGroup } from "../Controllers/group/create.js";
import { auth } from "../middleware/auth.js";


const GroupRouter = Router();
GroupRouter.route('/create').post(auth, createGroup);

export default GroupRouter;