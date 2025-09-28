import { List } from "./List";
import { AddTodo } from "./AddTodo";
import { useEffect, useState } from "react";
import { todoService } from "./services/todoService";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const getTodos = async () => {
    const data = await todoService.getAll();
    setTodos(data);
  };
  useEffect(() => {
    getTodos();
  }, []);

  const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedText = todo.trim();
    if (trimmedText) {
      setIsAdding(true);
      try {
        // Optimistic update
        const tempId = Date.now();
        setTodos((prevTodos) => [
          ...prevTodos,
          {
            id: tempId,
            text: trimmedText,
            completed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
        setTodo("");

        const newTodo = await todoService.create(trimmedText);

        setTodos(
          (prevTodos) =>
            prevTodos.map((t) => (t.id === tempId ? newTodo : t)) as Todo[]
        );
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create todo");
        setTodos(
          (prevTodos) =>
            prevTodos.filter((t) => t.text !== trimmedText) as Todo[]
        );
        setTodo(trimmedText);
      } finally {
        setIsAdding(false);
      }
    }
  };

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
          ) as Todo[]
        );

        await todoService.update(editingId, updatedText);

        setEditingId(null);
        setEditText("");
        setError(null);
      } catch (err) {
        setTodos(todos as Todo[]);
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
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Todo List</h1>
      <div className="flex flex-col items-center gap-4">
        <AddTodo
          todo={todo}
          setTodo={setTodo}
          // setTodos={setTodos}
          isAdding={isAdding}
          error={error}
          setError={setError}
          handleAddTodo={handleAddTodo}
        />
        <List
          todos={todos}
          setTodos={setTodos}
          handleStartEdit={handleStartEdit}
          handleSaveEdit={handleSaveEdit}
          handleCancelEdit={handleCancelEdit}
          isUpdating={isUpdating}
          editText={editText}
          setEditText={setEditText}
          error={error}
          setError={setError}
          editingId={editingId}
        />
      </div>
    </div>
  );
}

export default App;
