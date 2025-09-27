export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage for todos (replace with a database in production)
export const todos: Todo[] = [];
