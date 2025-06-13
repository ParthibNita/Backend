import { Router } from "express";
import {
  loginUser,
  logOutUser,
  registerUser,
  refreshAccessToken,
  changePassword,
  getCurrrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUsercoverImage,
  getUserChannelProfile,
  getWatchHistory,
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

//secured routes
router.route("/logout").post(verifyJWT, logOutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/currentUser").get(verifyJWT, getCurrrentUser);
router.route("/updateAccount").patch(verifyJWT, updateAccountDetails);
router
  .route("/avatarUpdate")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);
router
  .route("/coverImageUpdate")
  .patch(verifyJWT, upload.single("coverImage"), updateUsercoverImage);
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);
router.route("/History").get(verifyJWT, getWatchHistory);
export default router;
