import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'



const app = express();


app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"));
app.use(cookieParser());







var corsOptions = {
    origin: '*',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
};
var allowlist = process.env.WHITELIST_URL;
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




export default app;