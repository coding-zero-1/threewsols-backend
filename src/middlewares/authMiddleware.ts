import {type NextFunction } from "express";
import jwt from "jsonwebtoken";

function authMiddleware(req: any, res: any, next: NextFunction) {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        if(!decoded){
            return  res.status(401).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
export default authMiddleware;