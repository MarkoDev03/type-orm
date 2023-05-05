import { Router } from "express";
import { AccountController } from "../controllers/account.controller";
import { param, body, header } from "express-validator";
import { Constants } from "../common/constants";
import { validateRequest } from "../middleware/handlers/request-validator";
import passport from "passport";
import { Environment } from "../configuration/environment";
import { authOptions } from "../core/passport";

const routes = Router();
const controller = new AccountController();

routes.route("/info")
       .get(
              [passport.authenticate(Environment.AUTH_SCHEMA, authOptions)],
              controller.info
       );

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

routes.route("/change-password")
       .put(
              [passport.authenticate(Environment.AUTH_SCHEMA, authOptions)],
              [
                     param("oldPassword")
                            .isString()
                            .withMessage(Constants.IvalidDataType)
                            .notEmpty()
                            .withMessage(Constants.IvalidDataType),
                     param("newPassword")
                            .isString()
                            .withMessage(Constants.IvalidDataType)
                            .notEmpty()
                            .withMessage(Constants.IvalidDataType)
              ],
              validateRequest,
              controller.changePassword
       );

routes.route("/update")
       .put(
              [passport.authenticate(Environment.AUTH_SCHEMA, authOptions)],
              [
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
              controller.updateAccount
       );

routes.route("/delete")
       .delete(
              [passport.authenticate(Environment.AUTH_SCHEMA, authOptions)],
              [
                     body("password")
                            .isString()
                            .withMessage(Constants.IvalidDataType)
                            .notEmpty()
                            .withMessage(Constants.IvalidDataType)
              ],
              validateRequest,
              controller.deleteAccount
       );

export default routes;