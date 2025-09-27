import { Request, Response } from "express";
import { Todo, todos } from "../models/Todo.js";

export const getTodos = (req: Request, res: Response) => {
  res.json(todos);
};

export const createTodo = (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  const newTodo: Todo = {
    id: Date.now(),
    text,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
};

export const getTodoById = (req: Request, res: Response) => {
  const { id } = req.params;
  const todo = todos.find((todo) => todo.id === Number(id));

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  res.json(todo);
};

export const updateTodo = (req: Request, res: Response) => {
  const { id } = req.params;
  const { text, completed } = req.body;

  const todoIndex = todos.findIndex((todo) => todo.id === Number(id));

  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todos[todoIndex] = {
    ...todos[todoIndex],
    text: text ?? todos[todoIndex].text,
    completed: completed ?? todos[todoIndex].completed,
    updatedAt: new Date(),
  };

  res.json(todos[todoIndex]);
};

export const deleteTodo = (req: Request, res: Response) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex((todo) => todo.id === Number(id));

  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }

  todos.splice(todoIndex, 1);
  res.status(204).send();
};
