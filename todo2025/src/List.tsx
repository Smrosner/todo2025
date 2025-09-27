import { EditIcon, DeleteIcon } from "./lib/icons";
import { useState } from "react";
import { todoService } from "./services/todoService";

interface Todo {
  id: number;
  text: string;
}

export const List = ({
  todos,
  setTodos,
}: {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStartEdit = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const handleSaveEdit = async () => {
    if (editingId !== null && editText.trim()) {
      const updatedText = editText.trim();
      setIsUpdating(true);

      try {
        setTodos(
          todos.map((t) =>
            t.id === editingId ? { ...t, text: updatedText } : t
          )
        );

        await todoService.update(editingId, updatedText);

        setEditingId(null);
        setEditText("");
        setError(null);
      } catch (err) {
        setTodos(todos);
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error updating todo:", err);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  return (
    <div className="grid gap-4 w-full max-w-2xl mx-auto px-4">
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="btn btn-sm btn-ghost"
          >
            Dismiss
          </button>
        </div>
      )}
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="card bg-base-100 shadow-xl w-full min-w-[300px]"
        >
          <div className="card-body p-4 flex-row justify-between items-center">
            {editingId === todo.id ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveEdit();
                  } else if (e.key === "Escape") {
                    handleCancelEdit();
                  }
                }}
                className="flex-1 mr-4 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                autoFocus
              />
            ) : (
              <p className="card-title text-lg m-0 break-words flex-1 mr-4 flex items-center min-h-[24px]">
                {todo.text}
              </p>
            )}
            <div className="flex gap-2">
              <button
                className={`btn btn-circle btn-sm btn-neutral ${
                  isUpdating ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => handleStartEdit(todo)}
                disabled={isUpdating}
              >
                <EditIcon />
              </button>
              <button
                onClick={() => setTodos(todos.filter((t) => t.id !== todo.id))}
                className="btn btn-circle btn-sm btn-error"
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
