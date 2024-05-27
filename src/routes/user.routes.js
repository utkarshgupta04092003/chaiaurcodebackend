import { Router } from "express";
import {
    changeCurrentPassword,
    getCurrentUser,
    loginUser,
    logout,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        },
    ]),
    registerUser
);
router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logout);

router.route("/refreshaccesstoken").post(refreshAccessToken);

router.route("/changepassword").post(verifyJWT, changeCurrentPassword);

router.route("/updateaccountdetails").post(verifyJWT, updateAccountDetails);

router.route("/getcurrentuser").get(verifyJWT, getCurrentUser);

router.route("/updateprofileimage").post(
    verifyJWT, upload.single('avatar'), updateUserAvatar
)
router.route("/updatecoverimage").post(
    verifyJWT, upload.single('coverimage'), updateUserCoverImage
)

export default router;
