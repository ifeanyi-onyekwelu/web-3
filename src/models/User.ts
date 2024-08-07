import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
    username: string;
    fullName: string;
    email: string;
    password: string;
    roles: string[];
    createdAt: Date;
    refreshToken: string;
    emailVerificationToken: string | null
    active: boolean;
    deleted: boolean;
}

const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    active: {
        type:Boolean,
        default: false
    },
    deleted: {
        type:Boolean,
        default: false
    },
    refreshToken: {
        type: String
    },
    emailVerificationToken: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model<IUser>('User', userSchema);