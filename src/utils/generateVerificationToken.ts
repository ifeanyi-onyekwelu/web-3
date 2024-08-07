import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const generateVerificationToken = (userId: mongoose.Types.ObjectId) => {
    return jwt.sign({id: userId}, process.env.JWT_SECRET || "", { expiresIn: "30m"})
}

export default generateVerificationToken