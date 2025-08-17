import { UrlController } from "../controllers/url.controller";
import express from "express";

const shortUrlRouter = express.Router();
const urlController = UrlController.getInstance();

shortUrlRouter.get("/:shortUrl", urlController.redirectToOriginalUrl.bind(urlController));

export default shortUrlRouter;