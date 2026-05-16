import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi.js';
import { getToken, removeToken, setToken } from '../utils/tokenStorage.js';
import { getErrorMessage } from '../utils/errors.js';

const initialState = {
  user: null,
  token: getToken(),
  // 'idle' | 'restoring' | 'submitting' | 'authenticated' | 'guest'
  status: getToken() ? 'restoring' : 'guest',
  error: null,
};

export const signup = createAsyncThunk('auth/signup', async (payload, { rejectWithValue }) => {
  try {
    const data = await authApi.signup(payload);
    setToken(data.token);
    return data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, 'Signup failed'));
  }
});

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const data = await authApi.login(payload);
    setToken(data.token);
    return data;
  } catch (err) {
    return rejectWithValue(getErrorMessage(err, 'Login failed'));
  }
});

export const restoreSession = createAsyncThunk(
  'auth/restoreSession',
  async (_, { rejectWithValue }) => {
    const token = getToken();
    if (!token) return null;
    try {
      const user = await authApi.me();
      return { user, token };
    } catch (err) {
      removeToken();
      return rejectWithValue(getErrorMessage(err, 'Session expired'));
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      removeToken();
      state.user = null;
      state.token = null;
      state.status = 'guest';
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.status = 'submitting';
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'guest';
        state.error = action.payload || 'Signup failed';
      })
      .addCase(login.pending, (state) => {
        state.status = 'submitting';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'authenticated';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'guest';
        state.error = action.payload || 'Login failed';
      })
      .addCase(restoreSession.pending, (state) => {
        state.status = 'restoring';
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.status = 'authenticated';
        } else {
          state.status = 'guest';
        }
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.status = 'guest';
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
