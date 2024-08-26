import { Router } from "express";
import { send } from "../Controllers/chats/send.js";
import { auth } from "../middleware/auth.js";


const chatsRouter=Router();
chatsRouter.route('/write').post(auth,send);

export default chatsRouter;