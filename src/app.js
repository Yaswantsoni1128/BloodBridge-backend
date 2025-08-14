import express from "express";
import cors from 'cors';
const app = express() ;
import cookieParser from 'cookie-parser';

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({
    extended: true , 
    limit: "16kb"
}));

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));
app.use(express.static('public'));

app.use(cookieParser());

import userRouter from "./routes/user.routes.js"
import donorRouter from "./routes/donor.routes.js"
app.use('/api/user',userRouter);
app.use('/api/donor',donorRouter);

export {app}