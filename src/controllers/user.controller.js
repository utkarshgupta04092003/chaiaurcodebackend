import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ValidateEmail } from "../utils/ValidateEmail.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import {
    coverImageCloudinaryFoldername,
    profileImageCloudinaryFoldername,
} from "../constant.js";
import { removeFiles } from "../utils/removeFiles.js";

// generate access token and refresh token
const generateAccesstokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = await user.generateAccesstoken();
        const refreshToken = await user.generateRefreshtoken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (err) {
        throw new ApiError(500, "Something went wrong");
    }
};
const registerUser = asyncHandler(async (req, res) => {
    // take user input from frontend
    const { username, email, fullname, password } = req.body;
    // check for the file
    const avatarImageLocalPath = req.files?.avatar[0].path;
    let coverImageLocalPath = "";
    if (
        req.files &&
        Array.isArray(req.files.coverImage) &&
        req.files.coverImage.length > 0
    )
        coverImageLocalPath = req.files.coverImage[0].path;
    // empty validation
    if (
        [username, email, fullname, password].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }
    // validate email format
    if (!ValidateEmail(email)) {
        removeFiles(avatarImageLocalPath);
        removeFiles(coverImageLocalPath);
        throw new ApiError(400, "Invalid email format");
    }
    // check for the user is already exist or not
    const existUser = await User.findOne({
        $or: [{ username }, { email }],
    });
    if (existUser) {
        removeFiles(avatarImageLocalPath);
        removeFiles(coverImageLocalPath);
        throw new ApiError(409, "User with email or username already exist");
    }
    // upload the file to cloudinary
    const cloudinaryAvatarResponse = await uploadOnCloudinary(
        avatarImageLocalPath,
        profileImageCloudinaryFoldername
    );
    let cloudinaryCoverImageResponse = "";
    if (coverImageLocalPath)
        cloudinaryCoverImageResponse = await uploadOnCloudinary(
            coverImageLocalPath,
            coverImageCloudinaryFoldername
        );
    // create new user
    const createdUser = await User.create({
        username,
        fullname,
        email,
        password,
        avatar: cloudinaryAvatarResponse.url,
        coverImage: cloudinaryCoverImageResponse?.url || "",
    });
    // fetch the user details
    const registeredUser = await User.findById(createdUser?._id).select(
        "-password -refreshToken"
    );
    if (!registeredUser) {
        throw new ApiError(500, "something went wrong");
    }
    return res
        .status(201)
        .json(
            new ApiResponse(200, "User Registered Successfully", registeredUser)
        );
});

const loginUser = asyncHandler(async (req, res) => {
    // TODOS:
    // fetch the data from client side stored in req body
    // check whether user exist in db or not using email and password or username or password
    // generate access token and refresh token and stored it in db
    // send the user details with refresh and access toekn after deleting the password in cookies

    // fetch data from req body
    const { username, email, password } = req.body;
    console.log("username", username, email, password);

    if (!(username || email)) {
        throw new ApiError(400, "Username or email is required");
    }

    // find the user in the db
    const user = await User.findOne({
        $or: [{ username }, { email }],
    });
    // check user exists or not
    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const verifyPassword = await user.isPasswordCorrect(password);
    if (!verifyPassword) {
        throw new ApiError(401, "Invalid user credentials");
    }

    // create access toekna nd refresh toekn
    const { accessToken, refreshToken } =
        await generateAccesstokenAndRefreshToken(user._id);
    const loggedInUser = await User.findById(user._id).select("-password");

    // setup cookies
    const option = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(new ApiResponse(201, "User Logged In Successful", loggedInUser));
});

const logout = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) {
        throw new ApiError(500, "Invalid Access Token");
    }
    // remove refesh token from db
    await User.findByIdAndUpdate(
        userId,
        {
            $unset: {
                refreshToken: 1,
            },
        },
        {
            new: true,
        }
    );
    // setup cookie options
    const option = {
        httpOnly: true,
        secure: true,
    };
    // clear cookies from the request

    return res.status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, "Logout successfully"));
});
export { registerUser, loginUser, logout };
