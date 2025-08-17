import { UrlController } from "../controllers/url.controller";
import express from "express";
import { verifyToken } from "../middlewares/jwt";

export const urlRouter = express.Router();
const urlController = UrlController.getInstance();

urlRouter.post("/", verifyToken, urlController.createUrl.bind(urlController));
urlRouter.get("/", verifyToken, urlController.getAllUrls.bind(urlController));
urlRouter.get("/:id", verifyToken, urlController.getUrl.bind(urlController));
urlRouter.put("/:id", verifyToken, urlController.updateUrl.bind(urlController));

export default urlRouter;
