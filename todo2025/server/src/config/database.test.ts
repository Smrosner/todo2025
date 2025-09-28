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
