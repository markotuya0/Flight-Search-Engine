import { configureStore } from '@reduxjs/toolkit';
import flightSearchReducer from '../features/flightSearch/state/flightSearchSlice';

export const store = configureStore({
  reducer: {
    flightSearch: flightSearchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;