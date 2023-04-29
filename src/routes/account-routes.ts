import { Router } from "express";
import { AccountController } from "../controllers/account.controller";
import { param, body } from "express-validator";
import { Constants } from "../common/constants";
import { validateRequest } from "../middleware/handlers/request-validator";

const routes = Router();
const controller = new AccountController();

routes.route("/create")
       .post(
              [
                     body("username")
                            .notEmpty()
                            .withMessage(Constants.RequiredField)
                            .isLowercase()
                            .withMessage(Constants.IvalidDataType)
                            .isString()
                            .withMessage(Constants.IvalidDataType)
                            .if(body("username").contains(" "))
                            .withMessage(Constants.IvalidDataType),
                     body("password")
                            .notEmpty()
                            .withMessage(Constants.RequiredField)
                            .isString()
                            .withMessage(Constants.IvalidDataType),
                     body("email")
                            .isEmail()
                            .withMessage(Constants.IvalidDataType)
                            .notEmpty()
                            .withMessage(Constants.RequiredField)
                            .isString()
                            .withMessage(Constants.IvalidDataType),
                     body("phone")
                            .notEmpty()
                            .withMessage(Constants.RequiredField)
                            .isString()
                            .withMessage(Constants.IvalidDataType),

              ],
              validateRequest,
              controller.create
       );

routes.route("/info/:id")
       .get(
              [
                     param("id")
                            .isNumeric()
                            .withMessage(Constants.IvalidDataType)
                            .isInt()
                            .withMessage(Constants.IvalidDataType)
              ],
              validateRequest,
              controller.info
       );

routes.route("/verify/:token")
       .put(
              [
                     param("token")
                            .isString()
                            .withMessage(Constants.IvalidDataType)
                            .notEmpty()
                            .withMessage(Constants.IvalidDataType)
              ],
              validateRequest,
              controller.verifyAccount
       );

export default routes;