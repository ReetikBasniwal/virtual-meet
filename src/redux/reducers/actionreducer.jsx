import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createOffer, initializeListeners } from "../../server/peerConnection";

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
        },
        {
            urls: [
                "turn:openrelay.metered.ca:80",
                "turn:openrelay.metered.ca:443",
                "turn:openrelay.metered.ca:443?transport=tcp"
            ],
            username: "openrelayproject",
            credential: "openrelayproject"
        }
    ],
    iceCandidatePoolSize: 10
}

export const initializeRoom = createAsyncThunk(
    'room/initializeRoom',
    async ({ userId, roomId }, { dispatch, getState }) => {
        initializeListeners(userId, roomId, getState);
        return { userId, roomId };
    }
);

const actionSlice = createSlice({
    name: "room",
    initialState,
    reducers: {
        setUser: (state, action) => {
            // console.log(action.payload, "current user");
            state.user = action.payload
        },
        addParticipant: (state, action) => {
            let currentUserId = Object.keys(state.user)[0];
            let participantId = Object.keys(action.payload)[0];
            // ADD A KEY 'CURRENT_USER' AS TRUE IN THE PARTICIPANT IF THE PARTICIPANT IS CURRENT USER
            if(currentUserId === participantId){
                action.payload[participantId].currentUser = true;
            }
            const userCopy = JSON.parse(JSON.stringify(state.user));
            if(userCopy && state.mainStream && state.roomId && !action.payload[participantId].currentUser){
                addConection(userCopy, action.payload, state.mainStream, state.roomId);
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
        resetParticipant: (state, action) => {
            state.participants = action.payload;
        },
        setisRoomActive: (state, action) => {
            state.isActiveRoom = action.payload;
        },
        setMainStream: (state, action) => {
            state.mainStream = action.payload;
        },
        setRoomId: (state, action) => {
            state.roomId = action.payload;
        },
        extraReducers: (builder) => {
            builder.addCase(initializeRoom.fulfilled, (state, action) => {
                // Handle any additional state updates after initialization if needed
            });
        }
    }
})

export const roomReducer = actionSlice.reducer;

export const roomActions = actionSlice.actions;

const addConection = (currentUser, newUser, mediaStream, roomId) => {
    const peerConnection = new RTCPeerConnection(stunServers);
    
    // Add connection state monitoring
    peerConnection.onconnectionstatechange = (event) => {
        console.log('Connection state:', peerConnection.connectionState);
        if (peerConnection.connectionState === 'failed') {
            console.log('Connection failed, attempting to restart ICE...');
            peerConnection.restartIce();
        }
    };

    peerConnection.oniceconnectionstatechange = (event) => {
        console.log('ICE connection state:', peerConnection.iceConnectionState);
    };

    peerConnection.onicegatheringstatechange = (event) => {
        console.log('ICE gathering state:', peerConnection.iceGatheringState);
    };

    mediaStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, mediaStream);
    });
    
    const currentUseKey = Object.keys(currentUser)[0];
    const newUseKey = Object.keys(newUser)[0];
    
    const sortedIds = [currentUseKey, newUseKey].sort((a,b) => a.localeCompare(b));
    
    newUser[newUseKey].peerConnection = peerConnection;

    if(sortedIds[1] === currentUseKey) {
        createOffer(peerConnection, sortedIds[1], sortedIds[0], roomId, currentUser[currentUseKey].userName);
    }
}
