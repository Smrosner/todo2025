interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const API_BASE_URL = "http://localhost:3003/api/todos";

export const todoService = {
  async create(text: string): Promise<Todo> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to create todo");
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error(
          "Unable to connect to server. Please make sure the server is running."
        );
      }
      throw new Error(
        error instanceof Error ? error.message : "Failed to create todo"
      );
    }
  },

  async getAll(): Promise<Todo[]> {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch todos");
    }
    return await response.json();
  },

  async update(id: number, text: string): Promise<Todo> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error(
          "Unable to connect to server. Please make sure the server is running."
        );
      }
      throw new Error(
        error instanceof Error ? error.message : "Failed to update todo"
      );
    }
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete todo");
    }
  },

  async toggleComplete(id: number, completed: boolean): Promise<Todo> {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle todo completion status");
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        throw new Error(
          "Unable to connect to server. Please make sure the server is running."
        );
      }
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to toggle todo completion status"
      );
    }
  },
};
