export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage for todos (replace with a database in production)
export const todos: Todo[] = [
  {
    id: 1695900000000,
    text: "Complete project documentation",
    completed: false,
    createdAt: new Date("2025-09-28T08:00:00Z"),
    updatedAt: new Date("2025-09-28T08:00:00Z"),
  },
  {
    id: 1695900100000,
    text: "Review pull requests",
    completed: true,
    createdAt: new Date("2025-09-28T08:15:00Z"),
    updatedAt: new Date("2025-09-28T09:30:00Z"),
  },
  {
    id: 1695900200000,
    text: "Setup development environment",
    completed: false,
    createdAt: new Date("2025-09-28T08:30:00Z"),
    updatedAt: new Date("2025-09-28T08:30:00Z"),
  },
  {
    id: 1695900300000,
    text: "Plan sprint tasks",
    completed: false,
    createdAt: new Date("2025-09-28T08:45:00Z"),
    updatedAt: new Date("2025-09-28T08:45:00Z"),
  },
];
