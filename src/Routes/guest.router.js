import { Router } from "express";
import { auth } from "../middleware/auth.js";
import { JoinPrivateChat } from "../Controllers/guest/joinPrivateChat.js";

const Guest = Router();
Guest.route('/JoinPrivateGroup').post(auth, JoinPrivateChat)

export default Guest;