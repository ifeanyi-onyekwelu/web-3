import mongoose from "mongoose";
import * as process from "node:process";

const dbConn = () => {
    const CONN_STR = process.env.NODE_ENV === "production" ? process.env.PROD_DB : process.env.DEV_DB
    try {
        mongoose.connect(CONN_STR || "").then(r => console.log("MongoDB Connected!"))
    } catch (err: any) {
        console.log(`DB Error: ${err}`)
    }
}

export default dbConn