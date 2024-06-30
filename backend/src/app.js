import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: '16kb'}));
app.use(express.static('public'));
app.use(cookieParser());

app.use(express.urlencoded({
    extended: true
}))


// route import
import healthcheckRouter from './routes/healthcheck.routes.js'
import userRouter from './routes/user.routes.js';
import postRouter from './routes/post.routes.js';

// route decleration 
app.use("/api/v1/healthcheck", healthcheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/post", postRouter)

export {app};