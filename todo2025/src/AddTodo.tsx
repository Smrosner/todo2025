import { useState } from "react";
import { todoService } from "./services/todoService";

interface Todo {
  id: number;
  text: string;
}

interface AddTodoProps {
  todo: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

export const AddTodo = ({ todo, setTodo, setTodos }: AddTodoProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedText = todo.trim();
    if (trimmedText) {
      setIsAdding(true);
      try {
        // Optimistic update
        const tempId = Date.now();
        setTodos((prevTodos) => [
          ...prevTodos,
          { id: tempId, text: trimmedText },
        ]);
        setTodo("");

        const newTodo = await todoService.create(trimmedText);

        setTodos((prevTodos) =>
          prevTodos.map((t) => (t.id === tempId ? newTodo : t))
        );
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create todo");
        setTodos((prevTodos) =>
          prevTodos.filter((t) => t.text !== trimmedText)
        );
        setTodo(trimmedText);
      } finally {
        setIsAdding(false);
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="btn btn-sm btn-ghost"
            >
              Dismiss
            </button>
          </div>
        )}
        <div className="mb-4 flex items-center">
          <input
            type="text"
            placeholder="add a task to list"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            className="w-full px-3 py-2 border rounded-md mr-2"
            disabled={isAdding}
          />
          <button
            type="submit"
            className={`btn btn-primary ${isAdding ? "loading" : ""}`}
            disabled={isAdding}
          >
            {isAdding ? "Adding..." : "Add"}
          </button>
        </div>
      </form>
    </>
  );
};
