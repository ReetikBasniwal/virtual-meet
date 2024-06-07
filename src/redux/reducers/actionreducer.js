import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    participants: {},
    isActiveRoom: false,
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
            let currentUserId = Object.keys(state.user)[0];
            let participantId = Object.keys(action.payload)[0];
            if( currentUserId === participantId){
                action.payload[participantId].currentUser = true;
            }
            state.participants = {
                ...state.participants, 
                ...action.payload
            };
        },
        removeParticipant: (state, action) => {
            delete state.participants[action.payload.participantKey];
        },
        setisRoomActive: (state, action) => {
            state.isActiveRoom = action.payload;
        }
    }
})

export const roomReducer = actionSlice.reducer;

export const roomActions = actionSlice.actions;
