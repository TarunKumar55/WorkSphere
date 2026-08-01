import prisma from "../configs/prisma.js";

export const createProject = async (req, res) => {
  try {
    const {
      name,
      description,
      priority,
      status,
      start_date,
      end_date,
      team_lead,
      workspaceId,
    } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        priority,
        status,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        team_lead,
        workspaceId,
        members: {
          create: {
            userId: team_lead,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        tasks: true,
      },
    });

    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
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
    });

    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        name: req.body.name,
        description: req.body.description,
        status: req.body.status,
        priority: req.body.priority,
        start_date: req.body.start_date ? new Date(req.body.start_date) : null,
        end_date: req.body.end_date ? new Date(req.body.end_date) : null,
        progress: Number(req.body.progress || 0),
      },
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
    });

    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const addProjectMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    await prisma.projectMember.create({
      data: {
        projectId,
        userId,
      },
    });

    const project = await prisma.project.findUnique({
      where: { id: projectId },
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
    });

    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
