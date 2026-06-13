import prisma from "../configs/prisma.js";

export const addComment = async (req, res) => {
    try {
        const { content, taskId } = req.body;
        const { userId } = await req.auth();

        const comment = await prisma.comment.create({
            data: {
                content,
                taskId,
                userId,
            },
            include: {
                user: true,
            },
        });

        res.json({ comment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};