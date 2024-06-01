import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    participants: []
};

const actionSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        addParticipant: (state, action) => {
            // ADD A KEY 'CURRENT_USER' AS TRUE IN THE PARTICIPANT IF THE PARTICIPANT IS CURRENT USER
            state.participants = [...state.participants, action.payload];
        },
        removeParticipant: (state, action) => {
            state.currentUser = action.payload;
        }
    }
})

export const roomReducer = actionSlice.reducer;

export const roomActions = actionSlice.actions;
