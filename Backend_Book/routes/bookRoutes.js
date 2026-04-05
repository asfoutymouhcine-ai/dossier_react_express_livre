import express from "express";
import { getBooks, getBookById, addBook, updateBook, deleteBook } from "../controllers/bookController.js";
import { requireAuth, requireRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Toutes les routes livres demandent une authentification.
router.use(requireAuth);
router.get("/", requireRoles("client", "admin"), getBooks);
router.get("/:id", requireRoles("client", "admin"), getBookById);
router.post("/", requireRoles("client", "admin"), addBook);
router.put("/:id", requireRoles("admin"), updateBook);
router.delete("/:id", requireRoles("admin"), deleteBook);

export default router;
