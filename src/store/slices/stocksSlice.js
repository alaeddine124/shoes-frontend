import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchStats      = createAsyncThunk('stocks/fetchStats',  async () => (await api.get('/stocks/statistiques')).data);
export const fetchStocks     = createAsyncThunk('stocks/fetchAll',    async (params = {}) => (await api.get('/stocks', { params })).data);
export const createStock     = createAsyncThunk('stocks/create',      async (payload, { rejectWithValue }) => {
  try { return (await api.post('/stocks', payload)).data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Erreur'); }
});
export const mouvementStock  = createAsyncThunk('stocks/mouvement',   async ({ id, payload }, { rejectWithValue }) => {
  try { return (await api.post(`/stocks/${id}/mouvement`, payload)).data; }
  catch (err) { return rejectWithValue(err.response?.data?.message || 'Erreur'); }
});
export const fetchHistorique = createAsyncThunk('stocks/historique',  async id => {
  const { data } = await api.get(`/stocks/${id}/historique`);
  return { id, data };
});

const stocksSlice = createSlice({
  name: 'stocks',
  initialState: { items: [], stats: null, historique: {}, loading: false, statsLoading: false, error: null },
  reducers: { clearError: state => { state.error = null; } },
  extraReducers: builder => {
    builder
      .addCase(fetchStats.pending,        state => { state.statsLoading = true; })
      .addCase(fetchStats.fulfilled,      (state, { payload }) => { state.statsLoading = false; state.stats = payload; })
      .addCase(fetchStocks.pending,       state => { state.loading = true; })
      .addCase(fetchStocks.fulfilled,     (state, { payload }) => { state.loading = false; state.items = payload; })
      .addCase(createStock.fulfilled,     (state, { payload }) => { state.items.push(payload); })
      .addCase(mouvementStock.fulfilled,  (state, { payload }) => {
        const i = state.items.findIndex(s => s.id === payload.stock.id);
        if (i !== -1) state.items[i] = { ...state.items[i], ...payload.stock };
      })
      .addCase(mouvementStock.rejected,   (state, { payload }) => { state.error = payload; })
      .addCase(fetchHistorique.fulfilled, (state, { payload }) => { state.historique[payload.id] = payload.data; });
  },
});

export const { clearError } = stocksSlice.actions;
export default stocksSlice.reducer;
