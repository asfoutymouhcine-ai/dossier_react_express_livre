import express from "express";
import {
  createCategory,
  getCategories,
  deleteCategory,
} from "../controllers/categoryController.js";
import { requireAuth, requireRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(requireAuth);
router.get("/", requireRoles("client", "admin"), getCategories);
router.post("/", requireRoles("client", "admin"), createCategory);
router.delete("/:id", requireRoles("admin"), deleteCategory);

export default router;
