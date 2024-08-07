import Logger from "@/utils/logger";
import { Request, Response, NextFunction} from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error";
    Logger.error(res, message, statusCode);
}

export default errorHandler;