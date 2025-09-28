import db from "../config/database.js";

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export class TodoModel {
  static async getDb() {
    // Use test database if in test environment
    if (process.env.NODE_ENV === "test") {
      const { default: testDb } = await import("../config/database.test.js");
      return testDb;
    }
    return db;
  }

  static async create(title: string): Promise<Todo> {
    const database = await this.getDb();
    const stmt = database.prepare(
      "INSERT INTO todos (title, completed) VALUES (?, ?) RETURNING *"
    );
    const result = stmt.get([title, Number(false)]) as any;
    return { ...result, completed: Boolean(result.completed) };
  }

  static async getAll(): Promise<Todo[]> {
    const database = await this.getDb();
    const stmt = database.prepare(`
      SELECT * FROM todos
      ORDER BY datetime(created_at) DESC, id DESC
    `);
    const results = stmt.all() as any[];
    return results.map((todo) => ({
      ...todo,
      completed: Boolean(todo.completed),
    }));
  }

  static async getById(id: number): Promise<Todo | undefined> {
    const database = await this.getDb();
    const stmt = database.prepare("SELECT * FROM todos WHERE id = ?");
    const result = stmt.get([id]) as any;
    return result
      ? { ...result, completed: Boolean(result.completed) }
      : undefined;
  }

  static async update(
    id: number,
    data: Partial<Omit<Todo, "id" | "created_at">>
  ): Promise<Todo | undefined> {
    const todo = await this.getById(id);
    if (!todo) return undefined;

    const database = await this.getDb();
    const updates: string[] = [];
    const values: any[] = [];

    Object.entries(data).forEach(([key, value]) => {
      updates.push(`${key} = ?`);
      values.push(key === "completed" ? Number(value) : value);
    });

    updates.push("updated_at = CURRENT_TIMESTAMP");

    const stmt = database.prepare(`
      UPDATE todos
      SET ${updates.join(", ")}
      WHERE id = ?
      RETURNING *
    `);

    const result = stmt.get([...values, id]) as any;
    return result
      ? { ...result, completed: Boolean(result.completed) }
      : undefined;
  }

  static async toggleComplete(id: number): Promise<Todo | undefined> {
    const todo = await this.getById(id);
    if (!todo) return undefined;
    return this.update(id, { completed: !todo.completed });
  }

  static async delete(id: number): Promise<boolean> {
    const database = await this.getDb();
    const stmt = database.prepare("DELETE FROM todos WHERE id = ?");
    const result = stmt.run([id]);
    return result.changes > 0;
  }
}
