import jwt from "jsonwebtoken"

export const generateAccessToken = (user: {fullName: string, email: string, roles: string[]}) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET || "", {expiresIn: "15m"})
}

export const generateRefreshToken = (user: {fullName: string, email: string, roles: string[]}, rememberMe: boolean) => {
    const expiresIn = rememberMe ? '7d' : '1d'
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET || "", {expiresIn})
}