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
import smsRoutes from "./routes/sms.routes.js"

import inventoryRouter from "./routes/inventory.routes.js"
import inventorySettingsRouter from "./routes/inventorySettings.routes.js"
import alertRoutes from './routes/alert.routes.js'
app.use('/api/user',userRouter);
app.use('/api/donor',donorRouter);
app.use('/api/inventory',inventoryRouter);
app.use('/api/inventorySettings',inventorySettingsRouter);
app.use('/api', smsRoutes);
app.use('/api/alert', alertRoutes);

export {app}