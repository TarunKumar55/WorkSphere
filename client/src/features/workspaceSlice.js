import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    workspaces: [],
    currentWorkspace: null,
    loading: false,
};

const workspaceSlice = createSlice({
    name: "workspace",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setWorkspaces: (state, action) => {
            state.workspaces = action.payload;

            const savedWorkspaceId = localStorage.getItem("currentWorkspaceId");

            if (savedWorkspaceId) {
                state.currentWorkspace =
                    action.payload.find((w) => w.id === savedWorkspaceId) ||
                    action.payload[0] ||
                    null;
            } else {
                state.currentWorkspace = action.payload[0] || null;
            }
        },
        setCurrentWorkspace: (state, action) => {
            localStorage.setItem("currentWorkspaceId", action.payload);
            state.currentWorkspace =
                state.workspaces.find((w) => w.id === action.payload) || null;
        },
        addWorkspace: (state, action) => {
            state.workspaces.push(action.payload);

            if (state.currentWorkspace?.id !== action.payload.id) {
                state.currentWorkspace = action.payload;
            }
        },
        updateWorkspace: (state, action) => {
            state.workspaces = state.workspaces.map((w) =>
                w.id === action.payload.id ? action.payload : w
            );

            if (state.currentWorkspace?.id === action.payload.id) {
                state.currentWorkspace = action.payload;
            }
        },
        deleteWorkspace: (state, action) => {
            state.workspaces = state.workspaces.filter((w) => w.id !== action.payload);
        },
        addProject: (state, action) => {
            if (!state.currentWorkspace) return;

            state.currentWorkspace.projects.push(action.payload);

            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id
                    ? { ...w, projects: w.projects.concat(action.payload) }
                    : w
            );
        },
        addTask: (state, action) => {
            if (!state.currentWorkspace) return;

            state.currentWorkspace.projects = state.currentWorkspace.projects.map((p) => {
                if (p.id === action.payload.projectId) {
                    p.tasks.push(action.payload);
                }
                return p;
            });

            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id
                    ? {
                        ...w,
                        projects: w.projects.map((p) =>
                            p.id === action.payload.projectId
                                ? { ...p, tasks: p.tasks.concat(action.payload) }
                                : p
                        ),
                    }
                    : w
            );
        },
        updateTask: (state, action) => {
            if (!state.currentWorkspace) return;

            state.currentWorkspace.projects = state.currentWorkspace.projects.map((p) => {
                if (p.id === action.payload.projectId) {
                    p.tasks = p.tasks.map((t) =>
                        t.id === action.payload.id ? action.payload : t
                    );
                }
                return p;
            });

            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id
                    ? {
                        ...w,
                        projects: w.projects.map((p) =>
                            p.id === action.payload.projectId
                                ? {
                                    ...p,
                                    tasks: p.tasks.map((t) =>
                                        t.id === action.payload.id ? action.payload : t
                                    ),
                                }
                                : p
                        ),
                    }
                    : w
            );
        },
        deleteTask: (state, action) => {
            if (!state.currentWorkspace) return;

            state.currentWorkspace.projects = state.currentWorkspace.projects.map((p) => {
                p.tasks = p.tasks.filter((t) => !action.payload.includes(t.id));
                return p;
            });

            state.workspaces = state.workspaces.map((w) =>
                w.id === state.currentWorkspace.id
                    ? {
                        ...w,
                        projects: w.projects.map((p) => ({
                            ...p,
                            tasks: p.tasks.filter((t) => !action.payload.includes(t.id)),
                        })),
                    }
                    : w
            );
        },
    },
});

export const {
    setLoading,
    setWorkspaces,
    setCurrentWorkspace,
    addWorkspace,
    updateWorkspace,
    deleteWorkspace,
    addProject,
    addTask,
    updateTask,
    deleteTask,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;