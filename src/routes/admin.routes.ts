import { Router } from "express";
import { auth } from "../middlewares/auth.js";
import { requireRole } from "../middlewares/requireRole.js";
import { validate } from "../middlewares/validate.js";
import { setStatusSchema, paginationQuerySchema } from "../validators/admin.schema.js";
import { listPostsQuerySchema } from "../validators/post.schema.js";
import { listUsers, setUserStatus, listPosts, deletePost } from "../controllers/admin.controller.js";

const router = Router();
router.use(auth, requireRole("admin"));   

router.get("/users", validate(paginationQuerySchema, "query"), listUsers);
router.patch("/users/:id/status", validate(setStatusSchema), setUserStatus);
router.get("/posts", validate(listPostsQuerySchema, "query"), listPosts);
router.delete("/posts/:id", deletePost);

export default router;
