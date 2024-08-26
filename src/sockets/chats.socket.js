import { io } from "../app";

io.on('chats', (socket) => {
    console.log("User Connected");
})