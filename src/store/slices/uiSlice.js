import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen:   true,
    modal:         null,
    notifications: [],
  },
  reducers: {
    toggleSidebar:      state => { state.sidebarOpen = !state.sidebarOpen; },
    openModal:          (state, { payload }) => { state.modal = payload; },
    closeModal:         state => { state.modal = null; },
    addNotification:    (state, { payload }) => { state.notifications.push({ id: Date.now(), ...payload }); },
    removeNotification: (state, { payload }) => { state.notifications = state.notifications.filter(n => n.id !== payload); },
  },
});

export const { toggleSidebar, openModal, closeModal, addNotification, removeNotification } = uiSlice.actions;
export default uiSlice.reducer;