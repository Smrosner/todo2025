import express from "express";
import cors from "cors";
import morgan from "morgan";
import { Server } from "http";
import { exec } from "child_process";
import todoRoutes from "./routes/todos.js";
import runMigrations from "./config/runMigrations.js";

const app = express();
const PORT = Number(process.env.PORT) || 3003;

// Run database migrations
runMigrations();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/todos", todoRoutes);

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
        // Give OS time to release the port
        setTimeout(resolve, 1000);
      });
    });
  });
};

// Error handling for port in use
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

startServer();
