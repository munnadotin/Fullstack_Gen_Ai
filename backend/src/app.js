import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL, 
    credentials: true
}))

