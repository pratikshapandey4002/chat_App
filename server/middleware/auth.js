import { JsonWebTokenError } from "jsonwebtoken";
import User from "../models/User";


export const protectRoute = async (req, res, next) => {
    try {
        const token = req.headers.token;
        const decoded = JsonWebTokenError.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if(!user) return res.json({success: false, message : "user not found"});
        req.user = user;
        
    } catch (error) {
        res.json({success: false, message : error.message});

        
    }
}