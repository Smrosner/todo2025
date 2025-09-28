import { Request, Response } from "express";
import { Todo, TodoModel } from "../models/Todo.js";

// Type for creating/updating todos
interface TodoInput {
  title?: string;
  completed?: boolean;
}

export const getTodos = async (req: Request, res: Response) => {
  try {
    const todos = await TodoModel.getAll();
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
};

export const createTodo = async (req: Request, res: Response) => {
  try {
    const { title } = req.body as TodoInput;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const newTodo = await TodoModel.create(title);
    res.status(201).json(newTodo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: "Failed to create todo" });
  }
};

export const getTodoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const todo = await TodoModel.getById(Number(id));

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(todo);
  } catch (error) {
    console.error("Error fetching todo:", error);
    res.status(500).json({ error: "Failed to fetch todo" });
  }
};

export const updateTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body as TodoInput;

    // Ensure at least one valid field is being updated
    if (!updates.title && typeof updates.completed !== "boolean") {
      return res.status(400).json({ error: "No valid update fields provided" });
    }

    const updatedTodo = await TodoModel.update(Number(id), updates);

    if (!updatedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Failed to update todo" });
  }
};

export const deleteTodo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await TodoModel.delete(Number(id));

    if (!deleted) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
};
