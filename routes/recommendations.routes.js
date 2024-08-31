import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { recommendPlaces } from "../controllers/recommendation.controller.js";

const router   = Router();


router.route("/Destination").post(verifyJWT,  recommendPlaces)



export default router;