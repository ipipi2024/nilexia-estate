import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice';
import {persistReducer, persistStore} from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';
import themeReducer from './theme/themeSlice';

const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer
})

const PersistConfig = {
  key: 'root',
  storage,
  version: 1

};

const persistedReducer = persistReducer(PersistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
})

export const persistor = persistStore(store);