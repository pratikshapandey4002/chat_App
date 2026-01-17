import mongoose from "mongoose";
import User from '../models/User.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
// FIX 1: Correct spelling of cloudinary
import cloudinary from "../config/cloudinary.js"; 

export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  if (!fullName || !email || !password || !bio) {
    return res.status(400).json({ success: false, message: "Enter all fields" });
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ success: false, message: "Account already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    // Create the user
    const newUser = await User.create({
      fullName,
      email,
      password: hashPass,
      bio,
      profilePic: "" // Ensure profilePic has a default value if schema requires it
    });

    // Generate Token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // FIX 2: Send the token as a Cookie
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        httpOnly: true, // Prevent XSS attacks
        sameSite: "strict", // CSRF protection
        secure: process.env.NODE_ENV !== "development",
    });

    // FIX 3: Send the user data in the response
    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: {
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        bio: newUser.bio,
        profilePic: newUser.profilePic
      }
    });

  } catch (error) {
    console.log("Error in signup:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Enter data in all fields" });
  }

  try {
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    // Generate Token
    const token = jwt.sign({ id: userData._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // FIX 2: Send the token as a Cookie
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development",
    });

    // FIX 3: Send the user data so frontend can save it
    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        _id: userData._id,
        fullName: userData.fullName,
        email: userData.email,
        bio: userData.bio,
        profilePic: userData.profilePic
      }
    });

  } catch (error) {
    console.log("Error in login:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const checkAuth = (req, res) => {
    // Requires middleware to populate req.user
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    res.json({success: true, user: req.user});
}

export const updateProfile = async(req, res) => {
  try {
    const {profilePic, bio, fullName} = req.body;
    const userId = req.user._id;

    let updatedUser;
    
    // Logic looks fine, just ensuring error handling is consistent
    if(!profilePic){
      updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new:true});
    }
    else{ 
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(userId, {profilePic : upload.secure_url , bio, fullName}, {new:true});
    }

    res.status(200).json({success : true, user : updatedUser})

  } catch (error) {
    console.log("Error in update profile:", error.message);
    res.status(500).json({success : false, message : error.message});
  }
}