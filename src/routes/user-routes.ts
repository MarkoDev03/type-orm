import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const routes = Router();
const controller = new UserController();

routes.route("/all")
       .get(controller.getAll);

export default routes;