import express from "express";
import { createProject, getProject } from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.post("/", createProject);
projectRouter.get("/:projectId", getProject);

export default projectRouter;