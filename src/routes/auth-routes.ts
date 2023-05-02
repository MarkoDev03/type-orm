import { Router } from "express";
import { body } from "express-validator";
import { Constants } from "../common/constants";
import { validateRequest } from "../middleware/handlers/request-validator";
import { AuthController } from "../controllers/auth.controller";

const routes = Router();
const controller = new AuthController();

routes.route("/sign-in")
  .post(
    [
      body("username")
        .notEmpty()
        .withMessage(Constants.RequiredField)
        .isString()
        .withMessage(Constants.IvalidDataType),
      body("password")
        .notEmpty()
        .withMessage(Constants.RequiredField)
        .isString()
        .withMessage(Constants.IvalidDataType),
    ],
    validateRequest,
    controller.signIn
  );

export default routes;