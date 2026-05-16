import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { usersApi } from '../api/usersApi.js';
import { getErrorMessage } from '../utils/errors.js';

const initialState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
  try {
    return await usersApi.list();
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, 'Failed to load users'));
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load users';
      });
  },
});

export default usersSlice.reducer;
