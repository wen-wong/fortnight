import express from "express";
import controller from "../controllers/Post";
import { Schemas, ValidateSchema } from "../middleware/ValidateSchema";

const router = express.Router();

router.post("/create", ValidateSchema(Schemas.post.create), controller.createPost);
router.get("/get/:postId", controller.readPost);
router.get("/get/", controller.readAllPost);
router.patch("/update/:postId", ValidateSchema(Schemas.post.update), controller.updatePost);
router.delete("/delete/:postId", controller.deletePost);

export = router;
