import prisma from "../configs/prisma.js";

export const createTask = async (req, res) => {
    try {
        const { projectId, title, description, status, type, priority, assigneeId, due_date } = req.body;

        const task = await prisma.task.create({
            data: {
                projectId,
                title,
                description,
                status,
                type,
                priority,
                assigneeId,
                due_date: new Date(due_date),
            },
            include: {
                assignee: true,
                comments: true,
            },
        });

        res.json({ task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await prisma.task.update({
            where: { id: taskId },
            data: req.body,
            include: {
                assignee: true,
                comments: true,
            },
        });

        res.json({ task });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        await prisma.task.delete({
            where: { id: taskId },
        });

        res.json({ message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};