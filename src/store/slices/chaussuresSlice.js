import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchChaussures = createAsyncThunk('chaussures/fetchAll', async (params = {}) => {
  const { data } = await api.get('/chaussures', { params });
  return data;
});

export const createChaussure = createAsyncThunk('chaussures/create', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/chaussures', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (err) { return rejectWithValue(err.response?.data); }
});

export const updateChaussure = createAsyncThunk('chaussures/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/chaussures/${id}?_method=PUT`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  } catch (err) { return rejectWithValue(err.response?.data); }
});

export const deleteChaussure = createAsyncThunk('chaussures/delete', async id => {
  await api.delete(`/chaussures/${id}`);
  return id;
});

const chaussuresSlice = createSlice({
  name: 'chaussures',
  initialState: {
    items: [], pagination: null, loading: false,
    selected: null, filters: { search: '', categorie_id: '', marque: '' },
  },
  reducers: {
    setSelected:  (state, { payload }) => { state.selected = payload; },
    setFilters:   (state, { payload }) => { state.filters = { ...state.filters, ...payload }; },
    clearFilters: state => { state.filters = { search: '', categorie_id: '', marque: '' }; },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchChaussures.pending,   state => { state.loading = true; })
      .addCase(fetchChaussures.fulfilled, (state, { payload }) => {
        state.loading    = false;
        state.items      = payload.data;
        state.pagination = {
          current_page: payload.current_page,
          last_page:    payload.last_page,
          total:        payload.total,
        };
      })
      .addCase(fetchChaussures.rejected,  state => { state.loading = false; })
      .addCase(createChaussure.fulfilled, (state, { payload }) => { state.items.unshift(payload); })
      .addCase(updateChaussure.fulfilled, (state, { payload }) => {
        const i = state.items.findIndex(c => c.id === payload.id);
        if (i !== -1) state.items[i] = payload;
      })
      .addCase(deleteChaussure.fulfilled, (state, { payload }) => {
        state.items = state.items.filter(c => c.id !== payload);
      });
  },
});

export const { setSelected, setFilters, clearFilters } = chaussuresSlice.actions;
export default chaussuresSlice.reducer;