import prisma from "../configs/prisma.js";

export const getUserWorkspaces = async (req, res) => {
    try {
        const { userId } = await req.auth();

        const workspaces = await prisma.workspace.findMany({
            where: {
                members: {
                    some: {
                        userId,
                    },
                },
            },
            include: {
                members: {
                    include: {
                        user: true,
                    },
                },
                projects: {
                    include: {
                        members: {
                            include: {
                                user: true,
                            },
                        },
                        tasks: {
                            include: {
                                assignee: true,
                                comments: true,
                            },
                        },
                    },
                },
            },
        });

        res.json({ workspaces });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};