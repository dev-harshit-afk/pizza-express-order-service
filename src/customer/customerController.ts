import { Response } from "express";
import { Request } from "express-jwt";
import customerModel from "./customerModel";

export class CustomerController {
  getCustomer = async (req: Request, res: Response) => {
    const { firstName, lastName, email, sub: userId } = req.auth;

    const customer = await customerModel.findOne({ userId });

    if (!customer) {
      ///

      const newCustomer = await customerModel.create({
        firstName,
        lastName,
        email,
        userId,
        addresses: [],
      });
      return res.json(newCustomer);
    }

    return res.json(customer);
  };
}
