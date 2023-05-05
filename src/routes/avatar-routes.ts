import { Router } from "express";
import multer from "multer";
import { AvatarController } from "../controllers/avatar.controller";
import passport from "passport";
import { Environment } from "../configuration/environment";
import { authOptions } from "../core/passport";

const router = Router();

const controller = new AvatarController();

router.route("/upload")
  .post(
    multer().single("file"),
    [passport.authenticate(Environment.AUTH_SCHEMA, authOptions)],
    controller.upload
  );

export default router;