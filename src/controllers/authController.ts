import HttpError from "@/utils/errors";
import jwt from "jsonwebtoken"
import User from "@/models/User";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler"
import generateVerificationToken from "@/utils/generateVerificationToken";
import Logger from "@/utils/logger";
import {emailService} from "@/index";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwtUtils"


export const register = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) throw new HttpError(400, "Full name, email address and password must be provided!");

    if (await User.findOne({ email})) throw new HttpError(409, "Email address is already in use!")

    const newUser = new User({
        fullName,
        email,
        password
    })

    await newUser.save()

    const token = generateVerificationToken(newUser._id)
    newUser.emailVerificationToken = token
    await emailService.sendVerificationEmail(newUser, token)
    await newUser.save();

    Logger.success(res, "User registration successful", {user: newUser})
})

export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, rememberMe } = req.body;

    const rememberMeBool = rememberMe === true || rememberMe === 'true';
    if (!email || !password) throw new HttpError(400, "Email address and password must be provided!");

    const foundUser = await User.findOne({email});
    if (!foundUser) throw new HttpError(404, "Account not found!")

    const user = {
        fullName: foundUser.fullName,
        email: foundUser.email,
        roles: foundUser.roles
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user, rememberMeBool)

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    res.cookie("jwt", refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
    });

    await emailService.sendLoginNotification(foundUser)
    Logger.success(res, "Login successful", {accessToken})
})

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const { token }  = req.query;
    const decoded: any = jwt.verify(token as string, process.env.JWT_SECRET || "");
    const user = await User.findById(decoded?.id);

    if (!user) throw new HttpError(400, "Invalid Token");

    user.active = true
    user.emailVerificationToken = null
    user.save()
    Logger.success(res, "Email verified successfully, you can now log in.");
})

export const refresh = asyncHandler(async (req: Request, res: Response) => {
    const { token }  = req.body;
    if (!token) throw new HttpError(401, "Unauthorized!")
    const decoded: any = jwt.verify(token as string, process.env.REFRESH_TOKEN_SECRET || "");
    const user = {fullName: decoded.fullName, email: decoded.email, roles: decoded.roles}
    const accessToken = generateAccessToken(user)

    Logger.success(res, "New access token generated", { accessToken });
})