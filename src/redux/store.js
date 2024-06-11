import { configureStore } from "@reduxjs/toolkit";
import { roomReducer } from "./reducers/actionreducer";

export const store = configureStore({
  reducer: {
    roomReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['setMainStream'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['room.mainStream'],
      },
    }),
});
