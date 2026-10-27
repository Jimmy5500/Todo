import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./db";
import toDoRouter from "./routes/todo";
import cors from "cors";
const app = express();

dotenv.config({
  path: ".env",
});
const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
  }),
);
app.use(toDoRouter);

app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on :" + PORT);
});
