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
        ignoredActions: [
          'setMainStream',
          'addParticipant',
          'setUser',
          'setRoomId',
          'initializeRoom'
        ],
        // Ignore these field paths in all actions
        ignoredActionPaths: [
          'meta.arg',
          'payload',
          'payload.timestamp',
          'payload.peerConnection'
        ],
        // Ignore these paths in the state
        ignoredPaths: [
          'roomReducer.mainStream',
          'roomReducer.participants.*.peerConnection',
          'roomReducer.user.*.peerConnection',
          'roomReducer.user'
        ],
      },
    }),
});
