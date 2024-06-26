import { child, onChildAdded, push, ref } from "firebase/database";
import { db } from "./firebase";

const dbRef = ref(db);

export const createOffer = async (peerConnection, createrId, receiverId, id, currentUsername) => {
      
    const participantsRef = child(dbRef, `rooms/${id}/participants`);
    const receiverRef = child(participantsRef, `/${receiverId}`);
    const offer = await peerConnection.createOffer();

    peerConnection.onicecandidate = (event) => {
        if(event.candidate) {
            const offerCandidatesRef = child(receiverRef, "/offerCandidates")
            push(offerCandidatesRef, { ...event.candidate.toJSON(), userId: createrId })
        } 
    }

    await peerConnection.setLocalDescription(offer);

    const offerPayload = {
        sdp: offer.sdp,
        type: offer.type,
        userId: createrId,
        name: currentUsername
    }
    // To check who is making the offer the currentUsername is being added.
    
    let offerContainerRef = child(receiverRef, `/offers`);
    await push(offerContainerRef, { offerPayload });
}

export const initializeListeners = (currentUserId, roomId, getState) => {
    const participantsRef = child(dbRef, `rooms/${roomId}/participants`);
    const receiverRef = child(participantsRef, `${currentUserId}`);

    
    let tempRef = child(receiverRef, '/offers');
    onChildAdded(tempRef, async (snapshot) => {
        const data = snapshot.val();
        if(data?.offerPayload){
            const createrId = data.offerPayload.userId;
            let reduxState = getState();
            console.log(reduxState, reduxState.roomReducer.participants, "remotePeerConnection");
            const remotePeerConnection = reduxState.roomReducer.participants[createrId].peerConnection;
            await remotePeerConnection.setRemoteDescription(new RTCSessionDescription(data?.offerPayload));
            // CREATE AN ANSWER
            createAnswer(remotePeerConnection, currentUserId, createrId, roomId);
        }
    })

    let offerCandidatesRef = child(receiverRef, '/offerCandidates');
    onChildAdded(offerCandidatesRef, async (snapshot) => {
        const data = snapshot.val();
        if(data?.userId){
            let reduxState = getState();
            const peerConnection = reduxState.roomReducer.participants[data.userId].peerConnection;
            peerConnection.addIceCandidate(new RTCIceCandidate(data));

        }
    })

    let answersRef = child(receiverRef, '/answers');
    onChildAdded(answersRef, async (snapshot) => {
        const data = snapshot.val();
        if(data?.answerPayload){
            const createrId = data.answerPayload.userId;
            let reduxState = getState();
            const remotePeerConnection =reduxState.roomReducer.participants[createrId].peerConnection;
            await remotePeerConnection.setRemoteDescription(new RTCSessionDescription(data?.answerPayload));
        }
    })

    let answerCandidatesRef = child(receiverRef, '/answerCandidates');
    onChildAdded(answerCandidatesRef, async (snapshot) => {
        const data = snapshot.val();
        if(data?.userId){
            let reduxState = getState();
            const peerConnection = reduxState.roomReducer.participants[data.userId].peerConnection;
            peerConnection.addIceCandidate(new RTCSessionDescription(data));

        }
    })
}

const createAnswer = async (peerConnection, currentUserId, receiverId, roomId) => {
    try {
        const participantsRef = child(dbRef, `rooms/${roomId}/participants`);
        const receiverRef = child(participantsRef, `/${receiverId}`);
        const answer = await peerConnection.createAnswer();

        peerConnection.onicecandidate = (event) => {
            if(event.candidate) {
            const answerCandidatesRef = child(receiverRef, "/answerCandidates")
            push(answerCandidatesRef, { ...event.candidate.toJSON(), userId: currentUserId })
            }
        }

        await peerConnection.setLocalDescription(answer);
        
        const answerPayload = {
            sdp: answer.sdp,
            type: answer.type,
            userId: currentUserId
        }
        let answerContainerRef = child(receiverRef, `/answers`);
        await push(answerContainerRef, { answerPayload });
    } catch (error) {
        console.error('Error in creating answer:', error);
    }
}