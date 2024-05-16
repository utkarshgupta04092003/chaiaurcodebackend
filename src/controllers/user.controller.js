import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { ValidateEmail } from "../utils/ValidateEmail.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { coverImageCloudinaryFoldername, profileImageCloudinaryFoldername } from "../constant.js";

const registerUser = asyncHandler(async (req, res) => {
    // take user input from frontend
    const { username, email, fullname, password } = req.body;
    // empty validation
    if ([username, email, fullname, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    // validate email format
    if (!ValidateEmail(email)) {
        console.log('checking emal validation');
        throw new ApiError(400, "Invalid email format");
    }
    // check for the user is already exist or not
    const existUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existUser) {
        throw new ApiError(409, "User with email or username already exist");
    }
    // check for the file
    const avatarImageLocalPath = req.files?.avatar[0].path;
    let coverImageLocalPath = "";
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0)
        coverImageLocalPath = req.files.coverImage[0].path;
    // upload the file to cloudinary
    const cloudinaryAvatarResponse = await uploadOnCloudinary(avatarImageLocalPath, profileImageCloudinaryFoldername);
    let cloudinaryCoverImageResponse = "";
    if (coverImageLocalPath)
        cloudinaryCoverImageResponse = await uploadOnCloudinary(coverImageLocalPath, coverImageCloudinaryFoldername);
    // create new user
    const createdUser = await User.create({
        username, fullname, email, password,
        avatar: cloudinaryAvatarResponse.url,
        coverImage: cloudinaryCoverImageResponse?.url || ""
    })
    // fetch the user details
    const registeredUser = await User.findById(createdUser?._id).select("-password -refreshToken");
    if (!registeredUser) {
        throw new ApiError(500, "something went wrong");
    }
    return res.status(201).json(new ApiResponse(200, "User Registered Successfully", registeredUser))
})

export { registerUser };