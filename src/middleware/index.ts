import { Router } from "express";
import accountRoutes from "../routes/account-routes";
import mailServerRoutes from "../routes/mail-server-routes";
import settingsRoutes from "../routes/setting-routes";
import authenticationRoutes from "../routes/auth-routes";

const routes = Router();

routes.use("/account", accountRoutes);
routes.use("/mail-server", mailServerRoutes);
routes.use("/settings", settingsRoutes);
routes.use("/authentication", authenticationRoutes);

export { routes };