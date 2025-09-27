interface Todo {
  id: number;
  text: string;
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
};
