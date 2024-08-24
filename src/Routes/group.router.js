import { Router } from "express";
import { createGroup } from "../Controllers/group/create.js";
import { auth } from "../middleware/auth.js";
import { checkName } from "../Controllers/group/checkName.js";
import { deleteGroup } from "../Controllers/group/detele.js";


const GroupRouter = Router();
GroupRouter.route('/create').post(auth, createGroup);
GroupRouter.route('/checkName').post(auth, checkName);
GroupRouter.route('/delete').post(auth, deleteGroup);

export default GroupRouter;