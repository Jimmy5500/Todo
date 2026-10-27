import { Request, Response } from "express";
import { ToDo } from "../models/todo";

export const createNewToDo = async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const newToDo = await ToDo.create({
      title,
    });
    res.status(200).json({ message: "New Todo Added.", todo: newToDo });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getAllToDo = async (req: Request, res: Response) => {
  try {
    const todo = await ToDo.find();

    res.status(200).json({ message: "All Todo Retrieved", todos: todo });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getToDo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const todo = await ToDo.findById(id);

    if (!todo) {
      res.status(404).json({ message: "ToDo not found!" });
      return;
    }

    res.status(200).json({ message: "Todo Retrieved", todo: todo });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateToDo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    const todo = await ToDo.findByIdAndUpdate(id, {
      title,
    });
    if (!todo) {
      res.status(404).json({ message: "ToDo not found!" });
      return;
    }

    res.status(200).json({ message: "Todo Updated", todo: todo });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteToDo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const todo = await ToDo.findByIdAndDelete(id);
    if (!todo) {
      res.status(404).json({ message: "ToDo not found!" });
      return;
    }

    res.status(200).json({ message: "Todo Deleted", todo: todo });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
