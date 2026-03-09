import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "@/features/auth/authSlice";
import dashboardSlice from "@/features/dashboard/dashboardSlice";
import apiSlice from "./api";

// Persist config - only persist dashboard slice
const persistConfig = {
  key: "adtech",
  storage,
  whitelist: ["dashboard"], // Only persist dashboard state
};

const rootReducer = combineReducers({
  auth: authSlice,
  dashboard: dashboardSlice,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);
export default store;
