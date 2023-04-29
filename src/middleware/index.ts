import { Router } from "express";
import accountRoutes from "../routes/account-routes";

const routes = Router();

routes.use("/account", accountRoutes);

export { routes };