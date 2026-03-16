import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchCategories = createAsyncThunk('categories/fetchAll', async () => (await api.get('/categories')).data);
export const createCategorie = createAsyncThunk('categories/create',   async p  => (await api.post('/categories', p)).data);
export const deleteCategorie = createAsyncThunk('categories/delete',   async id => { await api.delete(`/categories/${id}`); return id; });

const categoriesSlice = createSlice({
  name: 'categories',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: b => {
    b.addCase(fetchCategories.fulfilled, (s, { payload }) => { s.items = payload; })
     .addCase(createCategorie.fulfilled, (s, { payload }) => { s.items.push(payload); })
     .addCase(deleteCategorie.fulfilled, (s, { payload }) => { s.items = s.items.filter(c => c.id !== payload); });
  },
});

export default categoriesSlice.reducer;