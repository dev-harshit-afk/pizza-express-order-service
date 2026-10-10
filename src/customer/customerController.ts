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
  addAddresses = async (req: Request, res: Response) => {
    const _id = req.params.id;
    const { sub: userId } = req.auth;

    const customer = await customerModel.findOneAndUpdate(
      { _id, userId },
      {
        $push: {
          addresses: {
            text: req.body.address,
            isDefault: false,
          },
        },
      },
      { new: true },
    );
    return res.json(customer);
  };
}
