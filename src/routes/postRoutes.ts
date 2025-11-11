import { Router } from "express";
import {
  getAllPostsController,
  postUploadController,
} from "../controllers/postControllers.js";
import configureCloudinary from "../config/cloudinaryConfig.js";
import upload from "../config/multerConfig.js";

const postRouter: Router = Router();

try {
  configureCloudinary();
} catch (error) {
  console.error("Cloudinary configuration error:", error);
}

postRouter.post("/upload", upload.single("image"), postUploadController);

postRouter.get("/all-post", getAllPostsController);

export default postRouter;
