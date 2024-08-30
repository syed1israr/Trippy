import { User } from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js"; 
import asyncHandler from "../utils/asyncHandler .js";


const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating refresh and access tokens");
  }
};


const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if ([fullName, email, password].some((field) => !field?.trim())) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const existedUser = await User.findOne({
    $or: [{ fullName }, { email }],
  });

  if (existedUser) {
    return res.status(409).json({ error: "User with email or username already exists" });
  }

  const user = await User.create({
    fullName,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    return res.status(500).json({ error: "Something went wrong while registering the user" });
  }

  return res.status(200).json({
    message: "User Created Successfully",
    user: createdUser,
  });
});

export { registerUser, generateAccessAndRefreshTokens };
