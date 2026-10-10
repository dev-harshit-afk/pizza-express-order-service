import { NextFunction, Response } from "express";
import { Request } from "express-jwt";
import createHttpError from "http-errors";
import couponModel from "./couponModel";

export class CouponController {
  createCoupon = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.auth);
    const { role, tenant } = req.auth;

    const { title, tenantId, code, validUpto, discount } = req.body;
    if (role === "manager" && tenantId !== tenant) {
      const error = createHttpError(
        400,
        "You are not authorized, Only the manager of the store aare authorized",
      );

      return next(error);
    }

    //check if the code alredy exists
    const coupon = await couponModel.find({ code, tenantId });
    if (coupon.length > 1) {
      const error = createHttpError(400, "Coupon already exist!");

      return next(error);
    }

    const newCoupon = await couponModel.create({
      code,
      tenantId,
      title,
      validUpto,
      discount,
    });

    return res.json({ coupon: newCoupon });
  };
  verify = async (req: Request, res: Response, next: NextFunction) => {
    const { code, tenantId } = req.body;

    //check if the code alredy exists
    const coupon = await couponModel.findOne({ code, tenantId });
    if (!coupon) {
      //   const error = createHttpError(400, "Coupon doesnnt exist !");

      //   return next(error);
      return res.json({ valid: false, discount: 0 });
    }

    const currentDate = new Date();
    const couponDate = new Date(coupon.validUpto);
    if (currentDate <= couponDate) {
      return res.json({ valid: true, discount: coupon.discount });
    }

    return res.json({ valid: false, discount: 0 });
  };
}
