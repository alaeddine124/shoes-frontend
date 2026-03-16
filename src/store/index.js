import { configureStore } from '@reduxjs/toolkit';
import authReducer         from './slices/authSlice';
import chaussuresReducer   from './slices/chaussuresSlice';
import stocksReducer       from './slices/stocksSlice';
import categoriesReducer   from './slices/categoriesSlice';
import fournisseursReducer from './slices/fournisseursSlice';
import uiReducer           from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth:         authReducer,
    chaussures:   chaussuresReducer,
    stocks:       stocksReducer,
    categories:   categoriesReducer,
    fournisseurs: fournisseursReducer,
    ui:           uiReducer,
  },
});

export default store;