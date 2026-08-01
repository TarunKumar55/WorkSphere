import express from "express";
import {
  createProject,
  getProject,
  updateProject,
} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.post("/", createProject);
projectRouter.get("/:projectId", getProject);
projectRouter.put("/:projectId", updateProject);

export default projectRouter;
