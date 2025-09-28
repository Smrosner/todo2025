import { TodoModel } from "../models/Todo.js";
import { resetTestDb, closeTestDb } from "../config/database.test.js";
import { TEST_PORT } from "../config/test.config.js";

// Set test environment
process.env.NODE_ENV = "test";
process.env.PORT = String(TEST_PORT);

describe("Todo Database Operations", () => {
  // Reset database before each test
  beforeEach(() => {
    resetTestDb();
  });

  // Close database connection after all tests
  afterAll(() => {
    closeTestDb();
  });

  describe("Create Todo", () => {
    it("should create a new todo", async () => {
      const todo = await TodoModel.create("Test todo");
      expect(todo).toBeDefined();
      expect(todo.title).toBe("Test todo");
      expect(todo.completed).toBe(false);
      expect(todo.id).toBeDefined();
      expect(todo.created_at).toBeDefined();
      expect(todo.updated_at).toBeDefined();
    });
  });

  describe("Read Todos", () => {
    it("should get all todos", async () => {
      // Create test todos
      await TodoModel.create("First todo");
      await TodoModel.create("Second todo");

      const todos = await TodoModel.getAll();
      expect(todos).toHaveLength(2);
      expect(todos[0].title).toBe("Second todo"); // Most recent first
      expect(todos[1].title).toBe("First todo");
    });

    it("should get todo by id", async () => {
      const created = await TodoModel.create("Test todo");
      const found = await TodoModel.getById(created.id);
      expect(found).toBeDefined();
      expect(found?.title).toBe("Test todo");
    });

    it("should return undefined for non-existent todo", async () => {
      const found = await TodoModel.getById(999);
      expect(found).toBeUndefined();
    });
  });

  describe("Update Todo", () => {
    it("should update todo title", async () => {
      const todo = await TodoModel.create("Original title");
      const updated = await TodoModel.update(todo.id, {
        title: "Updated title",
      });
      expect(updated).toBeDefined();
      expect(updated?.title).toBe("Updated title");
    });

    it("should toggle todo completion", async () => {
      const todo = await TodoModel.create("Test todo");
      const updated = await TodoModel.update(todo.id, { completed: true });
      expect(updated).toBeDefined();
      expect(updated?.completed).toBe(true);
    });

    it("should return undefined when updating non-existent todo", async () => {
      const updated = await TodoModel.update(999, { title: "Not found" });
      expect(updated).toBeUndefined();
    });
  });

  describe("Delete Todo", () => {
    it("should delete a todo", async () => {
      const todo = await TodoModel.create("To be deleted");
      const deleted = await TodoModel.delete(todo.id);
      expect(deleted).toBe(true);

      const found = await TodoModel.getById(todo.id);
      expect(found).toBeUndefined();
    });

    it("should return false when deleting non-existent todo", async () => {
      const deleted = await TodoModel.delete(999);
      expect(deleted).toBe(false);
    });
  });
});
