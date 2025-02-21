import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';  

import userReducer from './slices/userSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['user'],  
};

export const store = configureStore({
  reducer: {
    user: persistReducer(persistConfig, userReducer),  
  },
});

export const persistor = persistStore(store);  

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

