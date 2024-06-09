import { createSlice } from "@reduxjs/toolkit";
import { createOffer } from "../../server/peerConnection";

const initialState = {
    user: null,
    participants: {},
    isActiveRoom: false,
    mainStream: null,
    roomId: null,
};

const stunServers = {
    iceServers: [
        {
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun.l.google.com:5349",
                "stun:stun1.l.google.com:3478",
                "stun:stun1.l.google.com:5349",
                "stun:stun2.l.google.com:19302",
                "stun:stun.services.mozilla.com"
            ]
        }
    ]
}

const actionSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        addParticipant: (state, action) => {
            let currentUserId = Object.keys(state.user)[0];
            let participantId = Object.keys(action.payload)[0];
            // ADD A KEY 'CURRENT_USER' AS TRUE IN THE PARTICIPANT IF THE PARTICIPANT IS CURRENT USER
            if(currentUserId === participantId){
                action.payload[participantId].currentUser = true;
            }
            if(state.mainStream && state.roomId && !action.payload[participantId].currentUser){
                console.log("creating")
                addConection(state.currentUser, action.payload, state.mainStream, state.roomId);
            }
            action.payload[participantId].avatarColor = `#${Math.floor(Math.random()*16777215).toString(16)}`;
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
        },
        setMainStream: (state, action) => {
            state.mainStream = action.payload;
        },
        setRoomId: (state, action) => {
            state.roomId = action.payload;
        }
    }
})

export const roomReducer = actionSlice.reducer;

export const roomActions = actionSlice.actions;

const addConection = (currentUser, newUser, mediaStream, roomId) => {
    const peerConection = new RTCPeerConnection(stunServers);
    mediaStream.getTracks().forEach((track) => {
        peerConection.addTrack(track, mediaStream);
    })

    const currentUseKey = Object.keys(currentUser)[0];
    const newUseKey = Object.keys(newUser)[0];

    const sortedIds = [currentUseKey, newUseKey].sort((a,b) => a.localeCompare(b));

    newUser[newUseKey].peerConection = peerConection;

    if(sortedIds[1] === currentUseKey) {
        console.log("creating")
        createOffer(peerConection, sortedIds[1], sortedIds[0], roomId);
    }
}
