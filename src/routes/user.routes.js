import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();


router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxcount: 1

        },
        {
            name: "coverImage",
            maxcount: 1
        }
    ]), registerUser);

router.route("/login").post(loginUser)

//secured routes(as we have jwt associated)
router.route("/logout").post(
    verifyJWT, logoutUser
)

router.route("/refresh-token").post(refreshAccessToken)

export default router;