import { configureStore } from '@reduxjs/toolkit';
import { appSlice } from './features/appSlice';

// Configure the store
export const makeStore = () =>
    configureStore({
        reducer: {
            app: appSlice.reducer,
        },
    });

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
