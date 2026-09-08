import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./root-reducer";

import { persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// SSR-safe storage: redux-persist's default storage touches localStorage at
// import time, which doesn't exist in Node — hence "failed to create sync
// storage, falling back to noop storage" on every server render. Use the
// real web storage only in the browser, explicit noop on the server.
const createNoopStorage = () => ({
  getItem: (_key) => Promise.resolve(null),
  setItem: (_key, value) => Promise.resolve(value),
  removeItem: (_key) => Promise.resolve(),
});

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();


const persistConfig = {
  key: "sixam-mart",
  storage: storage,
  blacklist: ["categoryIds", "cashbackList", "brands", "configData"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
//store.js
export default configureStore({
  reducer: persistedReducer,
});
