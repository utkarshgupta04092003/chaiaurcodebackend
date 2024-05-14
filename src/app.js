import express, { urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// setup cors
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
// setup json
app.use(express.json({ limit: "16kb" }));
// setup urlencoder
app.use(urlencoded({ extended: true, limit: "16kb" }));
// setup cookie parser
app.use(cookieParser());
// setup public directory for the static documents
app.use(express.static('public'));



// import userRouter
import userRouter from './routes/user.routes.js';
// use userrouter for redirecting to router page
app.use('/api/v1/users', userRouter);
// http://localhost:3000/api/v1/users

export { app };
