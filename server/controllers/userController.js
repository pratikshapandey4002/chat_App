import mongoose from "mongoose";
import User from "../config/dataBase.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cloudinary from "../config/clodinary.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Enter data in all fields",
    });
  }

  try {
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "User with this email does not exist. Try registering",
      });
    }

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      { id: userData._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server Error" });
  }
};

export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  if (!fullName || !email || !password || !bio) {
    return res.status(400).json({
      success: false,
      message: "Enter all fields",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "Account already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashPass,
      bio,
    });

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "User Registered Successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Server Error" });
  }
};

//check user is authenticated or not
export const checkAuth = (req, res) => {
    res.json({success: true, user : req.user});
}

//update profile
export const updateProfile = async(req, res) => {
  try {
    const {profilePic, bio, fullName} = req.body;

    const userId = req.user._id;
    let updatedUser;
    if(!profilePic){
      updatedUser = await User.findByIdAndUpdate(userId, {bio, fullName}, {new:true});
    }
    else{ 
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(userId, {profilePic : upload.secure_url , bio, fullName}, {new:true});
    }

    res.status(200).json({success : true  , user : updatedUser})
  } catch (error) {
    res.json({success : false, message : error.message});
    
  }
}