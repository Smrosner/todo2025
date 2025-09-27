# Frontend Update Guide for Todo2025

## 1. Create API Service

Create a new file `src/services/todoApi.ts`:

```typescript
const API_BASE_URL = "http://localhost:3003/api/todos";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const todoApi = {
  // Get all todos
  getAllTodos: async () => {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) throw new Error("Failed to fetch todos");
    return response.json() as Promise<Todo[]>;
  },

  // Create a new todo
  createTodo: async (text: string) => {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error("Failed to create todo");
    return response.json() as Promise<Todo>;
  },

  // Update a todo
  updateTodo: async (
    id: number,
    updates: { text?: string; completed?: boolean }
  ) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error("Failed to update todo");
    return response.json() as Promise<Todo>;
  },

  // Delete a todo
  deleteTodo: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete todo");
  },
};
```

## 2. Update App.tsx

```typescript
import { useState, useEffect } from "react";
import { todoApi, Todo } from "./services/todoApi";
import { AddTodo } from "./AddTodo";
import { List } from "./List";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todo, setTodo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch todos on component mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const data = await todoApi.getAllTodos();
      setTodos(data);
    } catch (err) {
      setError("Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  // Pass these functions to your components
  const handleAddTodo = async (text: string) => {
    try {
      const newTodo = await todoApi.createTodo(text);
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      setError("Failed to add todo");
    }
  };

  const handleToggleTodo = async (id: number, completed: boolean) => {
    try {
      await todoApi.updateTodo(id, { completed });
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, completed } : todo))
      );
    } catch (err) {
      setError("Failed to update todo");
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await todoApi.deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (err) {
      setError("Failed to delete todo");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <AddTodo todo={todo} setTodo={setTodo} onAdd={handleAddTodo} />
      <List
        todos={todos}
        onToggle={handleToggleTodo}
        onDelete={handleDeleteTodo}
      />
    </div>
  );
}

export default App;
```

## 3. Update AddTodo.tsx

```typescript
interface AddTodoProps {
  todo: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  onAdd: (text: string) => Promise<void>;
}

export const AddTodo = ({ todo, setTodo, onAdd }: AddTodoProps) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (todo.trim()) {
      await onAdd(todo.trim());
      setTodo("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <div className="mb-4 flex items-center">
        <input
          type="text"
          placeholder="add a task to list"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          className="w-full px-3 py-2 border rounded-md mr-2"
        />
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </div>
    </form>
  );
};
```

## 4. Update List.tsx

```typescript
import { Todo } from "./services/todoApi";

interface ListProps {
  todos: Todo[];
  onToggle: (id: number, completed: boolean) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export const List = ({ todos, onToggle, onDelete }: ListProps) => {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id, !todo.completed)}
          />
          <span
            style={{ textDecoration: todo.completed ? "line-through" : "none" }}
          >
            {todo.text}
          </span>
          <button onClick={() => onDelete(todo.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
};
```

## 5. Error Handling Components

```typescript
// components/ErrorMessage.tsx
export const ErrorMessage = ({ message }: { message: string }) => (
  <div style={{ color: "red", padding: "10px" }}>{message}</div>
);

// components/LoadingSpinner.tsx
export const LoadingSpinner = () => <div>Loading...</div>;
```

## 6. Testing

1. Start your backend server:

```bash
cd server
npm run dev
```

2. In a new terminal, start your frontend:

```bash
cd todo2025
npm run dev
```

3. Test the following functionality:
   - Adding new todos
   - Toggling todo completion
   - Deleting todos
   - Loading initial todos
   - Error states (e.g., when server is down)

## Common Issues & Solutions

1. CORS errors:

   - Make sure your backend has CORS properly configured (already done in our setup)
   - Verify the API_BASE_URL matches your backend port

2. Type errors:

   - Ensure the Todo interface in frontend matches the backend
   - Use proper type annotations for async functions

3. State updates:

   - Always use functional updates with setTodos when updating based on previous state
   - Handle loading and error states appropriately

4. Network errors:
   - Implement proper error boundaries
   - Show user-friendly error messages
   - Add retry mechanisms for failed requests if needed

## Next Steps (Optional)

1. Add loading states for individual actions
2. Implement optimistic updates
3. Add error retry functionality
4. Implement todo editing
5. Add sorting and filtering
6. Implement pagination for large lists
