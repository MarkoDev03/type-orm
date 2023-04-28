import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const routes = Router();
const controller = new UserController();

routes.route("/get-all")
       .get(controller.getAll);


routes.route("/create")
       .post(controller.create);

routes.route("/:id")
       .get(controller.getById);

export default routes;