import { configureStore } from "@reduxjs/toolkit";
import { roomReducer } from "./reducers/actionreducer";

export const store = configureStore({
  reducer: {
    roomReducer,
  },
});
