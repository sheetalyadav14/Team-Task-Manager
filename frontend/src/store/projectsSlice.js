import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { projectsApi } from '../api/projectsApi.js';
import { getErrorMessage } from '../utils/errors.js';

const initialState = {
  list: [],
  current: null,
  loading: false,
  error: null,
};

export const fetchProjects = createAsyncThunk(
  'projects/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await projectsApi.list();
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to load projects'));
    }
  },
);

export const fetchProject = createAsyncThunk(
  'projects/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      return await projectsApi.get(id);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to load project'));
    }
  },
);

export const createProject = createAsyncThunk(
  'projects/create',
  async (payload, { rejectWithValue }) => {
    try {
      return await projectsApi.create(payload);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to create project'));
    }
  },
);

export const updateProject = createAsyncThunk(
  'projects/update',
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      return await projectsApi.update(id, payload);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to update project'));
    }
  },
);

export const removeProject = createAsyncThunk(
  'projects/delete',
  async (id, { rejectWithValue }) => {
    try {
      await projectsApi.remove(id);
      return id;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to delete project'));
    }
  },
);

export const addMember = createAsyncThunk(
  'projects/addMember',
  async ({ projectId, userId, role }, { rejectWithValue }) => {
    try {
      return await projectsApi.addMember(projectId, { user_id: userId, role });
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to add member'));
    }
  },
);

export const removeMember = createAsyncThunk(
  'projects/removeMember',
  async ({ projectId, userId }, { rejectWithValue }) => {
    try {
      return await projectsApi.removeMember(projectId, userId);
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to remove member'));
    }
  },
);

const replaceInList = (list, project) => {
  const idx = list.findIndex((p) => p.id === project.id);
  if (idx === -1) return list;
  const copy = list.slice();
  copy[idx] = project;
  return copy;
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearProjectError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load projects';
      })
      .addCase(fetchProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProject.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        state.list = replaceInList(state.list, action.payload);
      })
      .addCase(fetchProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load project';
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.list = replaceInList(state.list, action.payload);
        if (state.current?.id === action.payload.id) {
          state.current = action.payload;
        }
      })
      .addCase(removeProject.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
        if (state.current?.id === action.payload) state.current = null;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.list = replaceInList(state.list, action.payload);
        if (state.current?.id === action.payload.id) state.current = action.payload;
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.list = replaceInList(state.list, action.payload);
        if (state.current?.id === action.payload.id) state.current = action.payload;
      });
  },
});

export const { clearProjectError } = projectsSlice.actions;
export default projectsSlice.reducer;
