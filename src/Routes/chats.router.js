import { Router } from "express";
import { send } from "../Controllers/chats/send.js";
import { auth } from "../middleware/auth.js";
import { deleteChat } from "../Controllers/chats/delete.js";


const chatsRouter=Router();
chatsRouter.route('/write').post(auth,send);
chatsRouter.route('/delete').post(auth,deleteChat);

export default chatsRouter;