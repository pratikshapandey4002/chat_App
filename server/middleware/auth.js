import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
    try {
        // FIX 1: Read the token from the cookie, not the header
        const token = req.cookies.jwt; 

        if (!token) {
            return res.json({ success: false, message: "Not Authorized. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // FIX 2: Use 'decoded.id' because that is what you used in the login controller
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
        
    } catch (error) {
        console.log("Middleware Error:", error.message);
        return res.json({ success: false, message: "Invalid Token" });
    }
}