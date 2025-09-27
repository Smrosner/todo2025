import { List } from "./List";
import { AddTodo } from "./AddTodo";
import { useState } from "react";

interface Todo {
  id: number;
  text: string;
}

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8">Todo List</h1>
      <div className="flex flex-col items-center gap-4">
        <AddTodo todo={todo} setTodo={setTodo} setTodos={setTodos} />
        <List todos={todos} setTodos={setTodos} />
      </div>
    </div>
  );
}

export default App;
