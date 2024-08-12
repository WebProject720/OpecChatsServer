import { Router } from "express";
import { createGroup } from "../Controllers/group/create.js";
import { auth } from "../middleware/auth.js";
import { checkName } from "../Controllers/group/checkName.js";


const GroupRouter = Router();
GroupRouter.route('/create').post(auth, createGroup);
GroupRouter.route('/checkName').post(auth, checkName);

export default GroupRouter;