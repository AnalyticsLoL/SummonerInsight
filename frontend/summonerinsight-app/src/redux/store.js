import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import summonerReducer from './summonerSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage // Use localStorage
};
const persistedReducer = persistReducer(persistConfig, summonerReducer);

export const store = configureStore({
  reducer: {
    summoner: persistedReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Log actions with non-serializable data
        warnAfter: 200, // You can configure this to trigger warnings after a certain number of actions
        ignoredActions: ['persist/PERSIST'], // Leave this empty to catch all actions
        onError: (err) => {
          console.error('Non-Serializable Value Error:', err);
        },
      },
    }),
});

export const persistor = persistStore(store);