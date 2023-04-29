import { Router } from "express";
import accountRoutes from "../routes/account-routes";
import mailServerRoutes from "../routes/mail-server-routes";

const routes = Router();

routes.use("/account", accountRoutes);
routes.use("/mail-server", mailServerRoutes);

export { routes };