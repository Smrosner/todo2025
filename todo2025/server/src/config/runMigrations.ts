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
