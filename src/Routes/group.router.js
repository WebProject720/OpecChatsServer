import { Router } from "express";
import { createGroup } from "../Controllers/group/create.js";
import { auth } from "../middleware/auth.js";
import { checkName } from "../Controllers/group/checkName.js";
import { deleteGroup } from "../Controllers/group/detele.js";
import { getGroupDetails } from "../Controllers/group/getGroup.js";
import { join } from "../Controllers/group/join.js";
import { searchGroup } from "../Controllers/group/searchGroup.js";



const GroupRouter = Router();
GroupRouter.route('/create').post(auth, createGroup);
GroupRouter.route('/checkName').post(auth, checkName);
GroupRouter.route('/delete').post(auth, deleteGroup);
GroupRouter.route('/join').post(auth, join);
GroupRouter.route('/details').post(auth, getGroupDetails);
GroupRouter.route('/search').post(searchGroup);

export default GroupRouter;