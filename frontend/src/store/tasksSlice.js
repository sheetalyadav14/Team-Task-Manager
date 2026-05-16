import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { tasksApi } from '../api/tasksApi.js';
import { getErrorMessage } from '../utils/errors.js';

const initialState = {
  byProject: {},
  mine: [],
  stats: null,
  loading: false,
  error: null,
};

export const fetchTasksForProject = createAsyncThunk(
  'tasks/fetchForProject',
  async ({ projectId, filters }, { rejectWithValue }) => {
    try {
      const data = await tasksApi.forProject(projectId, filters);
      return { projectId, tasks: data };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to load tasks'));
    }
  },
);

export const fetchMyTasks = createAsyncThunk('tasks/fetchMine', async (_, { rejectWithValue }) => {
  try {
    return await tasksApi.mine();
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, 'Failed to load tasks'));
  }
});

export const fetchTaskStats = createAsyncThunk(
  'tasks/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      return await tasksApi.stats();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to load stats'));
    }
  },
);

export const createTask = createAsyncThunk(
  'tasks/create',
  async ({ projectId, payload }, { rejectWithValue }) => {
    try {
      return await tasksApi.create(projectId, payload);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to create task'));
    }
  },
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ taskId, payload }, { rejectWithValue }) => {
    try {
      return await tasksApi.update(taskId, payload);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to update task'));
    }
  },
);

export const removeTask = createAsyncThunk(
  'tasks/remove',
  async ({ taskId, projectId }, { rejectWithValue }) => {
    try {
      await tasksApi.remove(taskId);
      return { taskId, projectId };
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to delete task'));
    }
  },
);

const upsert = (list, task) => {
  const idx = list.findIndex((t) => t.id === task.id);
  if (idx === -1) return [task, ...list];
  const next = list.slice();
  next[idx] = task;
  return next;
};

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTasksError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksForProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksForProject.fulfilled, (state, action) => {
        state.loading = false;
        const tasks = action.payload.tasks;
        state.byProject[action.payload.projectId] = Array.isArray(tasks) ? tasks : [];
      })
      .addCase(fetchTasksForProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load tasks';
      })
      .addCase(fetchMyTasks.fulfilled, (state, action) => {
        state.mine = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTaskStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        const task = action.payload;
        state.byProject[task.project_id] = upsert(state.byProject[task.project_id] || [], task);
        state.mine = upsert(state.mine, task);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const task = action.payload;
        state.byProject[task.project_id] = upsert(state.byProject[task.project_id] || [], task);
        state.mine = upsert(state.mine, task);
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        const { taskId, projectId } = action.payload;
        if (state.byProject[projectId]) {
          state.byProject[projectId] = state.byProject[projectId].filter((t) => t.id !== taskId);
        }
        state.mine = state.mine.filter((t) => t.id !== taskId);
      });
  },
});

export const { clearTasksError } = tasksSlice.actions;
export default tasksSlice.reducer;
