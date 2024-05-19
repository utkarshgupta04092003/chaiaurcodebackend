import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    // TODO:
    // fetch token
    // decode token
    // verify token with the user db
    // add the user to the req object
    // call the next
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized user");
        }
        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded._id).select(
            "-password -refreshToken"
        );
        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(501, "Something went wrong")
    }
});
