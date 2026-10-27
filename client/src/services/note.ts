import type { Note } from "../types/note";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_MODE === "development"
    ? import.meta.env.VITE_LOCAL_URL
    : import.meta.env.VITE_API_URL;

// export const getNotes = async (): Promise<Note[]> => {
//   const response = await fetch(`${API_URL}/find`);
//   const data = await response.json();
//   return data.todos;
// };

// export const handleCreateNote = async (title: string): Promise<Note> => {
//   const response = await fetch(`${API_URL}/create`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ title }),
//   });

//   const data: { todo: Note } = await response.json();
//   return data.todo;
// };

export const getNotes = async (): Promise<Note[]> => {
  const { data } = await axios.get(`${API_URL}/find`);
  return data.todos;
};

export const handleCreateNote = async (title: string) => {
  await axios.post(`${API_URL}/create`, { title });
};

export const deleteNote = async (id: string) => {
  await axios.delete(`${API_URL}/delete/${id}`);
};

export const updateNote = async (id: string, title: string) => {
  const { data } = await axios.put(`${API_URL}/update/${id}`, {
    title,
  });

  return data.todos;
};
