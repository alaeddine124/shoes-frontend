import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/login', credentials);
    localStorage.setItem('token', data.token);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Erreur de connexion');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  try { await api.post('/logout'); } catch (_) {}
  localStorage.removeItem('token');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:    null,
    token:   localStorage.getItem('token'),
    loading: false,
    error:   null,
  },
  reducers: {
    clearError: state => { state.error = null; },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending,    state => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled,  (state, { payload }) => {
        state.loading = false;
        state.user    = payload.user;
        state.token   = payload.token;
      })
      .addCase(login.rejected,   (state, { payload }) => {
        state.loading = false;
        state.error   = payload;
      })
      .addCase(logout.fulfilled, state => {
        state.user  = null;
        state.token = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;