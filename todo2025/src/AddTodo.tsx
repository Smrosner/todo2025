// interface Todo {
//   id: number;
//   text: string;
// }

interface AddTodoProps {
  todo: string;
  setTodo: React.Dispatch<React.SetStateAction<string>>;
  // setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  isAdding: boolean;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  handleAddTodo: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}
// setTodos
export const AddTodo = ({
  todo,
  setTodo,
  isAdding,
  error,
  setError,
  handleAddTodo,
}: AddTodoProps) => {
  return (
    <>
      <form onSubmit={handleAddTodo} className="max-w-md mx-auto p-4">
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
