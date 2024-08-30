import { Router } from "express";
import { 
    changeCurrentPassword,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser, 
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router()

// without JWT 
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)

// //secured routes with JWT 
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)




export default router
