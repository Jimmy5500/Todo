import { Router } from "express";
import {
  createNewToDo,
  deleteToDo,
  getToDo,
  updateToDo,
  getAllToDo,
} from "../controllers/todo";

const router = Router();

router.post("/create", createNewToDo);
router.delete("/delete/:id", deleteToDo);
router.get("/find/:id", getToDo);
router.put("/update/:id", updateToDo);
router.get("/find", getAllToDo);

export default router;
