import { Router } from "express";
import { CouponController } from "./couponController";
import { asyncWrapper } from "../utils";
import authenticate from "../common/middleware/authenticate";

const router = Router();
const couponController = new CouponController();

router.post("/", authenticate, asyncWrapper(couponController.createCoupon));
router.get("/verify", authenticate, asyncWrapper(couponController.verify));

export default router;
