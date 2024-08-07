import "module-alias/register"
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config} from "dotenv";
import path from "path"

// Local Imports
import dbConn from "@/config/dbConn";
import corsOptions from "@/config/corsOptions";
import errorHandler from "@/middlewares/errorHandler";
import EmailService from "@/services/mail";

config();
dbConn();

const app = express();
const PORT = process.env.PORT || 3000;
export const emailService = new EmailService();

app.use(express.json())
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.urlencoded({ extended: false}))

app.use("/", (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, "build", "views", "index.html"))
})

app.all("*", (req: express.Request, res: express.Response) => {
    res.sendFile(path.join(__dirname, "build", "views", "404.html"))
})

app.use(errorHandler)

mongoose.connection.once("open", () => {
    app.listen(PORT, () => {
        console.log(`Server running on PORT: ${PORT}`)
    })
})