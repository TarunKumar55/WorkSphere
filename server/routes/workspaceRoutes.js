import express from "express";
import { getUserWorkspaces } from "../controllers/workspaceControllers.js";

const workspaceRouter = express.Router();

workspaceRouter.get("/", getUserWorkspaces);

export default workspaceRouter;