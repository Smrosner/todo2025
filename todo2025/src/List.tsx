import {
  EditIcon,
  DeleteIcon,
  CheckboxEmptyIcon,
  CheckboxCheckedIcon,
} from "./lib/icons";
import { todoService } from "./services/todoService";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export const List = ({
  todos,
  setTodos,
  handleStartEdit,
  handleSaveEdit,
  handleCancelEdit,
  isUpdating,
  editText,
  setEditText,
  error,
  setError,
  editingId,
  handleDelete,
}: {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  handleStartEdit: (todo: Todo) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  isUpdating: boolean;
  editText: string;
  setEditText: React.Dispatch<React.SetStateAction<string>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  editingId: number | null;
  handleDelete: (todoId: number) => Promise<void>;
}) => {
  return (
    <div className="grid gap-4 w-full max-w-2xl mx-auto px-4">
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button
            onClick={() => setError(null)} // setError
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
            <button
              className="p-3 text-xl hover:opacity-70 cursor-pointer mr-2"
              onClick={async () => {
                try {
                  const updatedTodo = await todoService.toggleComplete(
                    todo.id,
                    !todo.completed
                  );
                  setTodos(
                    todos.map((t) => (t.id === todo.id ? updatedTodo : t))
                  );
                } catch (err) {
                  setError(
                    err instanceof Error
                      ? err.message
                      : "Failed to toggle todo status"
                  );
                }
              }}
            >
              {todo.completed ? <CheckboxCheckedIcon /> : <CheckboxEmptyIcon />}
            </button>
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
              <p
                className={`card-title text-lg m-0 break-words flex-1 mr-4 flex items-center min-h-[24px] ${
                  todo.completed ? "line-through text-gray-500" : ""
                }`}
              >
                {todo.title}
              </p>
            )}
            <div className="flex gap-2">
              <button
                className={`btn btn-circle btn-sm ${
                  isUpdating || editingId !== null
                    ? "opacity-50 cursor-not-allowed bg-gray-300"
                    : "bg-gray-500 hover:bg-gray-600"
                }`}
                onClick={() => handleStartEdit(todo)}
                disabled={isUpdating || editingId !== null}
              >
                <EditIcon />
              </button>
              <button
                onClick={() => handleDelete(todo.id)}
                className="btn btn-circle btn-sm bg-red-800 hover:bg-red-900 border-none"
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
