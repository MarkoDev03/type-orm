import { Router } from "express";
import { MailServerController } from "../controllers/mail-server.controller";
import { body } from "express-validator";
import { Constants } from "../common/constants";
import { validateRequest } from "../middleware/handlers/request-validator";

const routes = Router();
const controller = new MailServerController();

routes.route("/create")
  .post(
    [
      body("host")
        .notEmpty()
        .withMessage(Constants.RequiredField)
        .isString()
        .withMessage(Constants.IvalidDataType),
      body("senderPassword")
        .notEmpty()
        .withMessage(Constants.RequiredField)
        .isString()
        .withMessage(Constants.IvalidDataType),
      body("senderEmail")
        .isEmail()
        .withMessage(Constants.IvalidDataType)
        .notEmpty()
        .withMessage(Constants.RequiredField)
        .isString()
        .withMessage(Constants.IvalidDataType),
      body("serviceType")
        .notEmpty()
        .withMessage(Constants.RequiredField)
        .isString()
        .withMessage(Constants.IvalidDataType),
      body("serviceType")
        .notEmpty()
        .withMessage(Constants.RequiredField)
        .isString()
        .withMessage(Constants.IvalidDataType),
      body("port")
        .isNumeric()
        .withMessage(Constants.RequiredField)
        .notEmpty()
        .withMessage(Constants.IvalidDataType),
    ],
    validateRequest,
    controller.create
  );

export default routes;