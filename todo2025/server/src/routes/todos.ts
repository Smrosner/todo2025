import express from "express";
const router = express.Router();

import {
  getTodos,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";

router.get("/", getTodos);

router.post("/", createTodo);

router.get("/:id", getTodoById);

router.put("/:id", updateTodo);

router.delete("/:id", deleteTodo);

export default router;
