import { Router } from "express";
import { asyncWrapper } from "../utils";
import { CustomerController } from "./customerController";
import authenticate from "../common/middleware/authenticate";

const router = Router();
const customerController = new CustomerController();

router.get("/", authenticate, asyncWrapper(customerController.getCustomer));
router.patch(
  "/address/:id",
  authenticate,
  asyncWrapper(customerController.addAddresses),
);

export default router;
