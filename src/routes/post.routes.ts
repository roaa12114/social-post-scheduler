import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import {
  createPostSchema,
  listPostsQuerySchema,
  updatePostSchema,
  scheduleSchema,
} from "../validators/post.schema.js";
import {
  createPost,
  listPosts,
  getPost,
  updatePost,
  deletePost,
  schedulePost,
} from "../controllers/post.controller.js";

const router = Router();

router.post("/", auth, validate(createPostSchema), createPost);
router.get("/", auth, validate(listPostsQuerySchema, "query"), listPosts);
router.get("/:id", auth, getPost);
router.patch("/:id", auth, validate(updatePostSchema), updatePost);
router.delete("/:id", auth, deletePost);
router.post("/:id/schedule", auth, validate(scheduleSchema), schedulePost);

export default router;
