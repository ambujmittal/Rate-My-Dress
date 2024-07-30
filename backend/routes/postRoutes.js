import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  likeUnlikePost,
  replyToPost,
  getFeedPosts,
  getUserPosts,
} from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.get("/feed", protectRoute, getFeedPosts);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.post(
  "/create",
  protectRoute,
  rateLimiter("createPost", 5, 60),
  createPost
);
router.delete("/:id", protectRoute, deletePost);
router.put("/like/:id", protectRoute, likeUnlikePost);
router.put("/reply/:id", protectRoute, replyToPost);

export default router;
