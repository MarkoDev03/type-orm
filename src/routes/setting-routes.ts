import { Router } from "express";
import { SettingsController } from "../controllers/settings.controller";
import { body, param } from "express-validator";
import { Constants } from "../common/constants";
import { validateRequest } from "../middleware/handlers/request-validator";

const routes = Router();
const controller = new SettingsController();

routes.route("/create")
  .post(
    [
      body("key")
        .notEmpty()
        .withMessage(Constants.RequiredField)
        .isString()
        .withMessage(Constants.IvalidDataType),
      body("value")
        .notEmpty()
        .withMessage(Constants.RequiredField)
        .isString()
        .withMessage(Constants.IvalidDataType),
      body("description")
        .notEmpty()
        .withMessage(Constants.RequiredField)
        .isString()
        .withMessage(Constants.IvalidDataType),
    ],
    validateRequest,
    controller.create
  );

routes.route("/update")
  .put(
    [
      body("id")
        .notEmpty()
        .withMessage(Constants.RequiredField)
        .isNumeric()
        .withMessage(Constants.IvalidDataType),
      body("key")
        .notEmpty()
        .withMessage(Constants.RequiredField)
        .isString()
        .withMessage(Constants.IvalidDataType),
      body("value")
        .notEmpty()
        .withMessage(Constants.RequiredField)
        .isString()
        .withMessage(Constants.IvalidDataType),
      body("description")
        .notEmpty()
        .withMessage(Constants.RequiredField)
        .isString()
        .withMessage(Constants.IvalidDataType),
    ],
    validateRequest,
    controller.update
  );

routes.route("/get-all")
  .get(controller.getAll);

routes.route("/:settingId")
  .get(
    [
      param("settingId")
        .notEmpty()
        .withMessage(Constants.RequiredField)
        .isString()
        .withMessage(Constants.IvalidDataType),
    ],
    validateRequest,
    controller.get
  );

export default routes;