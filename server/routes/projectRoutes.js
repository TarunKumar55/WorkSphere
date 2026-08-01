import express from "express";
import {
  createProject,
  getProject,
  updateProject,
  addProjectMember,
} from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.post("/", createProject);
projectRouter.get("/:projectId", getProject);
projectRouter.put("/:projectId", updateProject);
projectRouter.post("/:projectId/members", addProjectMember);

export default projectRouter;
