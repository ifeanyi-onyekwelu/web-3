import { Response } from "express";

class Logger {
    static success (res: Response, message: string, data: null | {} =null) {
        res.status(200).json({
            status: 'success',
            message,
            data
        })
    }

    static error (res: Response, message: string, statusCode=500, data=null) {
        res.status(statusCode).json({
            status: 'error',
            message,
            data
        })
    }
}

export default Logger;