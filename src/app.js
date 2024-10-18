import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'
import { Server } from 'socket.io';
import { createServer } from 'node:http'
import 'dotenv/config'
import { verifyToken } from './utils/verifyToken.js';
const app = express();
const server = createServer(app)


app.use(express.json())
// app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));
app.use(cookieParser());







var allowlist = process.env.WHITELIST_URL;
const isProduction = process.env.PRODUCTION == 'true';

var corsOptions = isProduction ? {
    origin: allowlist,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
} : {
    origin: 'http://localhost:3000',
    credentials: true
};


import { send } from './Controllers/chats/send.js';
export const io = new Server(server)
io.on('connection', async (socket) => {
    socket.on('join-group', (group) => {
        socket.join(group);
        io.to(group).emit('new-user-added', { msg: 'Someone Added', activeUsers: io.sockets.adapter.rooms.get(group).size })
    })
    socket.on('delete-msg', async (data) => {
        const user = await getCookie(socket);
        if (user.success) {
            const res = await deleteChat({ _id: user?._id, identifier: data?.identifier }, null)

            if (res.success) {
                io.to(data.room).emit('deleted-msg', res?.data)
            } else {
                io.emit('error-msg', { error: res.msg, msg: "Not Deleted !", success: false })
                return { msg: 'Msg not send' }
            }
        } else {
            io.emit('error-msg', { error: user.msg, msg: "Not Deleted !!", success: false })
            return { msg: 'Msg not send' }
        }
    })

    socket.on('disconnect', () => { })

    socket.on('group-msg', async (msg) => {
        try {
            const cookie = (socket.handshake.headers?.cookie);
            if (!cookie) {
                io.emit('error-msg', { error: null, msg: "cookie not found", success: false })
                return { msg: "cookie not found" }
            }
            let string = cookie.slice(cookie.indexOf('=') + 1)
            let verify;
            try {
                verify = verifyToken(string);
            } catch (error) {
                console.log(error);
                io.emit('error-msg', { error, msg: "Token not verified", success: false })
                return { msg: "Token not verified" }
            }

            const chatObject = { _id: verify?._id || null, ...msg };
            const response = await send({ body: chatObject }, false);


            if (!response.success) {
                io.emit('error-msg', { error: response, msg: "Msg not send", success: false })
                return { msg: 'Msg not send' }
            }

            io.to(msg.identifier).emit('new-msg', response?.data)

        } catch (error) {
            console.log(error);
            return;
        }
    })
})



app.use(cors(corsOptions))


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 200, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false
})
app.use(limiter);


import UserRouter from './Routes/user.router.js';
app.use('/api/v1/user', UserRouter);
import authRouter from './Routes/auth.router.js';
app.use('/api/v1/auth', authRouter);
import GroupRouter from './Routes/group.router.js';
app.use('/api/v1/group', GroupRouter);
import chatsRouter from './Routes/chats.router.js';
app.use('/api/v1/chat', chatsRouter);
import Guest from './Routes/guest.router.js';
import { deleteChat } from './Controllers/chats/delete.js';
import { getCookie } from './utils/getCookies.js';
app.use('/api/v1/guest', Guest);







app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>OpecChats Server</title>
          <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                text-align: center;
                padding: 50px;
            }
            h1 {
                color: #333;
            }
          </style>
      </head>
      <body>
          <h1>Welcome to the OpecChats Server!</h1>
          <p>This is a Landing page for OpecChats Server.</p>
      </body>
      </html>
    `);
});







export default server;