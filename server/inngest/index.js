import { Inngest } from "inngest";
import prisma from "../configs/prisma.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "worksphere" });

// Inngest Function to save user data to db
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.upsert({
      where: {
        id: data.id,
      },
      update: {
        email: data?.email_addresses[0]?.email_address,
        name: `${data?.first_name || ""} ${data?.last_name || ""}`.trim(),
        image: data?.image_url || "",
      },
      create: {
        id: data.id,
        email: data?.email_addresses[0]?.email_address,
        name: `${data?.first_name || ""} ${data?.last_name || ""}`.trim(),
        image: data?.image_url || "",
      },
    });
  },
);

// Inngest function to delete user from db
const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-from-clerk",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.delete({
      where: {
        id: data.id,
      },
    });
  },
);

// Inngest Function to update user data in db
const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    const { data } = event;

    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        email: data?.email_addresses[0]?.email_address,
        name: `${data?.first_name || ""} ${data?.last_name || ""}`.trim(),
        image: data?.image_url || "",
      },
    });
  },
);

// Inngest Function to save workspace data to db
const syncWorkspaceCreation = inngest.createFunction(
  {
    id: "sync-workspace-from-clerk",
    triggers: [{ event: "clerk/organization.created" }],
  },
  async ({ event }) => {
    const { data } = event;

    await prisma.workspace.upsert({
      where: {
        id: data.id,
      },
      update: {
        name: data.name,
        slug: data.slug,
        image_url: data.image_url || "",
      },
      create: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        ownerId: data.created_by,
        image_url: data.image_url || "",
      },
    });

    await prisma.workspaceMember.upsert({
      where: {
        userId_workspaceId: {
          userId: data.created_by,
          workspaceId: data.id,
        },
      },
      update: {
        role: "ADMIN",
      },
      create: {
        userId: data.created_by,
        workspaceId: data.id,
        role: "ADMIN",
      },
    });
  },
);

// Inngest Function to save workspace member data to db
const syncWorkspaceMemberCreation = inngest.createFunction(
  {
    id: "sync-workspace-member-from-clerk",
    triggers: [{ event: "clerk/organizationInvitation.accepted" }],
  },
  async ({ event }) => {
    const { data } = event;

    await prisma.workspaceMember.upsert({
      where: {
        userId_workspaceId: {
          userId: data.user_id,
          workspaceId: data.organization_id,
        },
      },
      update: {
        role: String(data.role_name || "member").toUpperCase(),
      },
      create: {
        userId: data.user_id,
        workspaceId: data.organization_id,
        role: String(data.role_name || "member").toUpperCase(),
      },
    });
  },
);

// Export functions
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  syncWorkspaceCreation,
  syncWorkspaceMemberCreation,
];
