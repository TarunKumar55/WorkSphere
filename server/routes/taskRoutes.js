import express from "express";
import { createTask, updateTask, deleteTask } from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter.post("/", createTask);
taskRouter.put("/:taskId", updateTask);
taskRouter.delete("/:taskId", deleteTask);

export default taskRouter;