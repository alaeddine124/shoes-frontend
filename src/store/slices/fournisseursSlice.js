import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchFournisseurs = createAsyncThunk('fournisseurs/fetchAll', async () => (await api.get('/fournisseurs')).data);
export const createFournisseur = createAsyncThunk('fournisseurs/create',   async p  => (await api.post('/fournisseurs', p)).data);
export const deleteFournisseur = createAsyncThunk('fournisseurs/delete',   async id => { await api.delete(`/fournisseurs/${id}`); return id; });

const fournisseursSlice = createSlice({
  name: 'fournisseurs',
  initialState: { items: [], loading: false },
  reducers: {},
  extraReducers: b => {
    b.addCase(fetchFournisseurs.fulfilled, (s, { payload }) => { s.items = payload; })
     .addCase(createFournisseur.fulfilled, (s, { payload }) => { s.items.push(payload); })
     .addCase(deleteFournisseur.fulfilled, (s, { payload }) => { s.items = s.items.filter(f => f.id !== payload); });
  },
});

export default fournisseursSlice.reducer;