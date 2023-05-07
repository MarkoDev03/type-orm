import { Router } from "express";
import accountRoutes from "../routes/account-routes";
import mailServerRoutes from "../routes/mail-server-routes";
import settingsRoutes from "../routes/setting-routes";
import authenticationRoutes from "../routes/auth-routes";
import avatarRoutes from "../routes/avatar-routes";

const routes = Router();

routes.use("/account", accountRoutes);
routes.use("/mail-server", mailServerRoutes);
routes.use("/settings", settingsRoutes);
routes.use("/authentication", authenticationRoutes);
routes.use("/avatar", avatarRoutes);

export { routes };