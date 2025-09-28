# SQLite Setup Guide for Todo2025

This guide will help you set up SQLite in your Todo2025 application. Check off each item as you complete it.

## Installation & Initial Setup

- [x] Install the `better-sqlite3` package (recommended for TypeScript/Node.js projects)

  ```bash
  cd server
  npm install better-sqlite3
  npm install @types/better-sqlite3 --save-dev
  ```

- [x] Create a database directory

  ```bash
  mkdir server/db
  ```

- [x] Add database file to `.gitignore`

  ```bash
  echo "server/db/*.sqlite" >> .gitignore
  ```

## Database Configuration

- [x] Create a database configuration file at `server/src/config/database.ts`

  ```typescript
  import Database from "better-sqlite3";
  import path from "path";
  import { fileURLToPath } from "url";

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const dbPath = path.join(__dirname, "../../db/todo.sqlite");
  const db = new Database(dbPath);

  export default db;
  ```

  Note: We use `fileURLToPath` and `import.meta.url` because `__dirname` is not available in ES modules.

## Schema Setup

- [x] Create a migration file at `server/src/migrations/init.sql`
- [x] Run migrations on server startup

  ```typescript
  // server/src/index.ts
  import runMigrations from "./config/runMigrations.js";

  // Run database migrations
  runMigrations();
  ```

  ```sql
  -- Add your table creation SQL here
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```

- [x] Create a migration runner at `server/src/config/runMigrations.ts`

  ```typescript
  import fs from "fs";
  import path from "path";
  import { fileURLToPath } from "url";
  import db from "./database.js";

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const runMigrations = () => {
    const migration = fs.readFileSync(
      path.join(__dirname, "../migrations/init.sql"),
      "utf8"
    );
    db.exec(migration);
  };

  export default runMigrations;
  ```

## Model Updates

- [x] Update the Todo model to work with SQLite

  - Modify `server/src/models/Todo.ts` to use SQLite instead of current implementation

  Steps completed:

  1. Updated Todo interface to match SQLite schema:

     ```typescript
     export interface Todo {
       id: number;
       title: string;
       completed: boolean;
       created_at: string;
       updated_at: string;
     }
     ```

  2. Created TodoModel class with CRUD operations:
     - `create`: Insert new todos
     - `getAll`: Retrieve all todos
     - `getById`: Get single todo
     - `update`: Update todo fields
     - `toggleComplete`: Toggle completion status
     - `delete`: Remove todos
  3. Implemented prepared statements for SQL injection protection
  4. Added automatic timestamp updates for `updated_at`
  5. Added proper TypeScript types for all methods

## Controller Updates

- [x] Update the Todo controller to use SQLite queries

  - Modify `server/src/controllers/todoController.ts` to use SQLite operations

  Steps to complete:

  1. Update imports to use new TodoModel class
  2. Modify controller methods to use TodoModel:
     - `getTodos`: Use TodoModel.getAll()
     - `createTodo`: Use TodoModel.create()
     - `getTodoById`: Use TodoModel.getById()
     - `updateTodo`: Use TodoModel.update()
     - `deleteTodo`: Use TodoModel.delete()
  3. Update error handling for SQLite operations
  4. Update request/response types to match new schema
  5. Add try/catch blocks for database operations

## Testing

- [x] Create a test database configuration

  Understanding Test Databases:

  - A test database is a separate database instance used specifically for running tests
  - Key differences from the main database:
    1. Isolated data: Test data won't affect your production/development data
    2. Fresh state: Can be reset between tests
    3. Parallel testing: Multiple tests can run without interfering with each other
    4. Safe experimentation: Can test destructive operations without risk

  Implementation:

  ```typescript
  // server/src/config/test.config.ts
  export const TEST_PORT = 3004; // Different from development port

  // server/src/config/database.test.ts
  import Database from "better-sqlite3";
  import path from "path";
  import fs from "fs";
  import { fileURLToPath } from "url";

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // Get migration SQL
  const getMigrationSQL = () => {
    return fs.readFileSync(
      path.join(__dirname, "../migrations/init.sql"),
      "utf8"
    );
  };

  // Initialize database
  let testDb: Database.Database | null = null;

  // Get or create test database
  export const getTestDb = () => {
    if (!testDb || !testDb.open) {
      testDb = new Database(":memory:");
      testDb.exec(getMigrationSQL());
    }
    return testDb;
  };

  // Helper function to reset database between tests
  export const resetTestDb = () => {
    const db = getTestDb();
    db.exec("DELETE FROM todos");
  };

  // Helper function to close database connection
  export const closeTestDb = () => {
    if (testDb && testDb.open) {
      testDb.close();
      testDb = null;
    }
  };

  // Initialize on import
  getTestDb();

  export default getTestDb();
  ```

  And update the model to handle test environment:

  ```typescript
  export class TodoModel {
    static async getDb() {
      // Use test database if in test environment
      if (process.env.NODE_ENV === "test") {
        const { default: testDb } = await import("../config/database.test.js");
        return testDb;
      }
      return db;
    }

    // ... rest of the model methods using this.getDb()
  }
  ```

  Configure Jest to ignore test utilities:

  ```javascript
  // server/jest.config.js
  export default {
    preset: "ts-jest/presets/default-esm",
    testEnvironment: "node",
    extensionsToTreatAsEsm: [".ts"],
    moduleNameMapper: {
      "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    transform: {
      "^.+\\.tsx?$": [
        "ts-jest",
        {
          useESM: true,
        },
      ],
    },
    // Ignore configuration files that don't need tests
    testPathIgnorePatterns: [
      "/node_modules/",
      "/dist/",
      "database.test.ts",
      "test.config.ts",
    ],
  };
  ```

  Usage in tests:

  ```typescript
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

    // ... your tests here
  });
  ```

- [x] Add basic database operations test

  - Created `server/src/__tests__/database.test.ts`
  - Implemented comprehensive test suite:

  Steps completed:

  1. Set up test structure:

     ```typescript
     import { TodoModel } from "../models/Todo.js";
     import { resetTestDb, closeTestDb } from "../config/database.test.js";
     import { TEST_PORT } from "../config/test.config.js";

     describe("Todo Database Operations", () => {
       beforeEach(() => resetTestDb());
       afterAll(() => closeTestDb());
       // ... tests
     });
     ```

  2. Implemented CRUD operation tests:

     - Create:
       - Test new todo creation
       - Verify all fields are set correctly
     - Read:
       - Test fetching all todos
       - Test fetching single todo by ID
       - Test handling non-existent todos
     - Update:
       - Test updating todo title
       - Test toggling completion status
       - Test handling updates to non-existent todos
     - Delete:
       - Test successful deletion
       - Test deletion of non-existent todos

  3. Added test lifecycle management:

     - Reset database before each test
     - Close database connection after all tests
     - Proper cleanup of resources

  4. Verified edge cases:
     - Non-existent todo handling
     - Order of returned todos
     - Field validation

  Setup test environment:

  ```bash
  cd server
  npm install --save-dev jest @types/jest ts-jest
  ```

  Add to package.json:

  ```json
  {
    "scripts": {
      "test": "jest"
    },
    "jest": {
      "preset": "ts-jest",
      "testEnvironment": "node"
    }
  }
  ```

  To run the tests:

  ```bash
  npm test
  ```

## Security & Best Practices

- [ ] Implement prepared statements for all SQL queries to prevent SQL injection
- [ ] Add error handling for database operations
- [ ] Implement proper database connection closing
- [ ] Add database backup strategy
- [x] Add server error handling

  ```typescript
  import { Server } from "http";
  import { exec } from "child_process";

  // Kill existing process on port
  const killPort = (port: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      const command =
        process.platform === "win32"
          ? `netstat -ano | findstr :${port}`
          : `lsof -i :${port} | grep LISTEN | awk '{print $2}'`;

      exec(command, (error, stdout) => {
        if (error || !stdout) {
          resolve(); // No process found, that's fine
          return;
        }

        const pid =
          process.platform === "win32"
            ? stdout.split("\n")[0].split(/\s+/)[4]
            : stdout.trim();

        const killCommand =
          process.platform === "win32"
            ? `taskkill /F /PID ${pid}`
            : `kill -9 ${pid}`;

        exec(killCommand, (error) => {
          if (error) {
            reject(error);
            return;
          }
          setTimeout(resolve, 1000); // Give OS time to release port
        });
      });
    });
  };

  // Error handling for port in use using proper Node.js types
  const startServer = async () => {
    try {
      await killPort(PORT);
      const server = app.listen(PORT);

      server.on("error", (error: NodeJS.ErrnoException) => {
        console.error("Error starting server:", error);
        process.exit(1);
      });

      server.on("listening", () => {
        console.log(`Server is running on port ${PORT}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  };
  ```

## Environment Configuration

- [ ] Add database configuration to environment variables

  ```bash
  # server/.env
  DB_PATH=db/todo.sqlite
  NODE_ENV=development
  ```

## Final Steps

- [ ] Test all CRUD operations with the new SQLite implementation
- [ ] Update API documentation to reflect any changes in response formats
- [ ] Add database backup instructions to project documentation
- [ ] Review and optimize initial SQL queries

## Additional Resources

- [better-sqlite3 Documentation](https://github.com/JoshuaWise/better-sqlite3)
- [SQLite Official Documentation](https://www.sqlite.org/docs.html)
- [Node.js SQLite Best Practices](https://www.sqlite.org/whentouse.html)

## Notes

- The setup uses `better-sqlite3` as it's one of the fastest and most reliable SQLite packages for Node.js
- All SQL operations are synchronous by design in `better-sqlite3`, which helps avoid callback hell and complexity
- The database file will be created automatically when first accessed
- Remember to handle database closing properly when the server shuts down
- When using ES modules (type: "module" in package.json):
  - Add `.js` extension to imports even for TypeScript files
  - Use `fileURLToPath` and `import.meta.url` instead of `__dirname`
  - This applies to all file path operations in ES modules
- SQLite parameter binding:
  - Use positional parameters (`?`) in SQL queries
  - Pass parameters as an array: `stmt.get([param1, param2])`
  - For single parameters, still use an array: `stmt.get([id])`
  - Use `run()` for INSERT/UPDATE/DELETE without RETURNING
  - Use `get()` for single row queries and RETURNING clauses
  - Use `all()` for multiple row queries
  - Handle boolean values:
    - Store as integers (0/1) in SQLite
    - Convert to/from booleans in TypeScript
    - Example: `Number(boolValue)` for storage, `Boolean(intValue)` for retrieval
- Test Database Management:
  - Use in-memory SQLite for tests (`:memory:`)
  - Maintain a single connection throughout test run
  - Reset data between tests (don't recreate database)
  - Close connection only after all tests complete
  - Use dynamic imports for test database in model
  - Configure Jest to ignore test utility files
  - Set proper test environment variables

After completing all these steps, your Todo2025 application will be successfully integrated with SQLite!
