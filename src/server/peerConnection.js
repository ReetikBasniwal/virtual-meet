import { child, onChildAdded, push, ref } from "firebase/database";
import { db } from "./firebase";
import { store } from "../redux/store";

const dbRef = ref(db);

export const createOffer = async (peerConnection, createrId, receiverId, id) => {
      
    const participantsRef = child(dbRef, `rooms/${id}/participants`);
    const receiverRef = child(participantsRef, `/${receiverId}`);
    const offer = await peerConnection.createOffer();

    peerConnection.onicecandidate = (event) => {
        event.candidate && child(receiverRef, "offerCandidates").push({ ...event.candidate.toJson(), userId: createrId })
    }

    await peerConnection.setLocalDescription(offer);
    console.log(receiverId, "desc")
    const offerPayload = {
        sdp: offer.sdp,
        type: offer.type,
        userId: createrId
    }
    let offerContainerRef = child(receiverRef, `/offers`);
    await push(offerContainerRef, { offerPayload });
}

export const initializeListeners = (currentUserId, roomId) => {
    const participantsRef = child(dbRef, `rooms/${roomId}/participants`);
    const receiverRef = participantsRef.child(currentUserId);

    let tempRef = child(receiverRef, 'offers');
    onChildAdded(tempRef, async (snapshot) => {
        const data = snapshot.val();
        if(data?.offerPayload){
            const createrId = data.offerPayload.userId;
            const remotePeerConnection = store.getState().participants[createrId].peerConnection;
            await remotePeerConnection.setRemoteDescription(new RTCSessionDescription(data?.offerPayload));

            // CREATE AN ANSWER
            createAnswer(remotePeerConnection, currentUserId, createrId, roomId);
        }
    })

    let offerCandidatesRef = child(receiverRef, 'offerCandidates');
    onChildAdded(offerCandidatesRef, async (snapshot) => {
        const data = snapshot.val();
        if(data?.userId){
            const peerConnection = store.getState().participants[data.userId].peerConnection;
            peerConnection.addIceCandidates(new RTCIceCandidate(data));

        }
    })

    let answersRef = child(receiverRef, 'answers');
    onChildAdded(answersRef, async (snapshot) => {
        const data = snapshot.val();
        if(data?.answerPayload){
            const createrId = data.answerPayload.userId;
            const remotePeerConnection = store.getState().participants[createrId].peerConnection;
            await remotePeerConnection.setRemoteDescription(new RTCSessionDescription(data?.answerPayload));
        }
    })

    let answerCandidatesRef = child(receiverRef, 'answerCandidates');
    onChildAdded(answerCandidatesRef, async (snapshot) => {
        const data = snapshot.val();
        if(data?.userId){
            const peerConnection = store.getState().participants[data.userId].peerConnection;
            peerConnection.addIceCandidates(new RTCSessionDescription(data));

        }
    })
}

const createAnswer = async (peerConnection, currentUserId, receiverId, roomId) => {
    const participantsRef = child(dbRef, `rooms/${roomId}/participants`);
    const receiverRef = child(participantsRef, `/${receiverId}`);
    const answer = await peerConnection.createAnswer();

    peerConnection.onicecandidate = (event) => {
        event.candidate && child(receiverRef, "answerCandidates").push({ ...event.candidate.toJson(), userId: currentUserId })
    }

    await peerConnection.setLocalDescription(answer);
    console.log(receiverId, "desc")
    const answerPayload = {
        sdp: answer.sdp,
        type: answer.type,
        userId: currentUserId
    }
    let answerContainerRef = child(receiverRef, `/answers`);
    await push(answerContainerRef, { answerPayload });
}