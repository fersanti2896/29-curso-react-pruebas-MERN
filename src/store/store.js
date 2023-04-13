import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { caldendarSlice } from './calendar';
import { uiSlice } from './ui';
import { authSlice } from './auth';

export const store = configureStore({
    reducer: {
        ui: uiSlice.reducer,
        calendar: caldendarSlice.reducer,
        auth: authSlice.reducer
    }, 
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
});