import { child, onChildAdded, push, ref } from "firebase/database";
import { db } from "./firebase";

const dbRef = ref(db);

export const createOffer = async (peerConnection, createrId, receiverId, id, currentUsername) => {
    try {
        const participantsRef = child(dbRef, `rooms/${id}/participants`);
        const receiverRef = child(participantsRef, `/${receiverId}`);
        const offer = await peerConnection.createOffer();

        peerConnection.onicecandidate = (event) => {
            if(event.candidate) {
                const offerCandidatesRef = child(receiverRef, "/offerCandidates")
                push(offerCandidatesRef, { ...event.candidate.toJSON(), userId: createrId })
                    .catch(error => console.error('Error pushing ICE candidate:', error));
            } 
        }

        await peerConnection.setLocalDescription(offer);

        const offerPayload = {
            sdp: offer.sdp,
            type: offer.type,
            userId: createrId,
            name: currentUsername
        }
        
        let offerContainerRef = child(receiverRef, `/offers`);
        await push(offerContainerRef, { offerPayload });
    } catch (error) {
        console.error('Error in createOffer:', error);
        throw error;
    }
}

export const initializeListeners = (currentUserId, roomId, getState) => {
    const participantsRef = child(dbRef, `rooms/${roomId}/participants`);
    const receiverRef = child(participantsRef, `${currentUserId}`);

    let tempRef = child(receiverRef, '/offers');
    onChildAdded(tempRef, async (snapshot) => {
        try {
            const data = snapshot.val();
            if(data?.offerPayload){
                const createrId = data.offerPayload.userId;
                let reduxState = getState();
                const remotePeerConnection = reduxState.roomReducer.participants[createrId].peerConnection;
                
                if (!remotePeerConnection) {
                    console.error('No peer connection found for creator:', createrId);
                    return;
                }

                await remotePeerConnection.setRemoteDescription(new RTCSessionDescription(data?.offerPayload))
                    .catch(error => {
                        console.error('Error setting remote description:', error);
                        throw error;
                    });
                
                // CREATE AN ANSWER
                await createAnswer(remotePeerConnection, currentUserId, createrId, roomId);
            }
        } catch (error) {
            console.error('Error processing offer:', error);
        }
    });

    let offerCandidatesRef = child(receiverRef, '/offerCandidates');
    onChildAdded(offerCandidatesRef, async (snapshot) => {
        try {
            const data = snapshot.val();
            if(data?.userId){
                let reduxState = getState();
                const peerConnection = reduxState.roomReducer.participants[data.userId].peerConnection;
                
                if (!peerConnection) {
                    console.error('No peer connection found for candidate:', data.userId);
                    return;
                }

                await peerConnection.addIceCandidate(new RTCIceCandidate(data))
                    .catch(error => console.error('Error adding ICE candidate:', error));
            }
        } catch (error) {
            console.error('Error processing ICE candidate:', error);
        }
    });

    let answersRef = child(receiverRef, '/answers');
    onChildAdded(answersRef, async (snapshot) => {
        try {
            const data = snapshot.val();
            if(data?.answerPayload){
                const createrId = data.answerPayload.userId;
                let reduxState = getState();
                const remotePeerConnection = reduxState.roomReducer.participants[createrId].peerConnection;
                
                if (!remotePeerConnection) {
                    console.error('No peer connection found for answer:', createrId);
                    return;
                }

                await remotePeerConnection.setRemoteDescription(new RTCSessionDescription(data?.answerPayload))
                    .catch(error => console.error('Error setting remote description for answer:', error));
            }
        } catch (error) {
            console.error('Error processing answer:', error);
        }
    });

    let answerCandidatesRef = child(receiverRef, '/answerCandidates');
    onChildAdded(answerCandidatesRef, async (snapshot) => {
        try {
            const data = snapshot.val();
            if(data?.userId){
                let reduxState = getState();
                const peerConnection = reduxState.roomReducer.participants[data.userId].peerConnection;
                
                if (!peerConnection) {
                    console.error('No peer connection found for answer candidate:', data.userId);
                    return;
                }

                await peerConnection.addIceCandidate(new RTCIceCandidate(data))
                    .catch(error => console.error('Error adding answer ICE candidate:', error));
            }
        } catch (error) {
            console.error('Error processing answer ICE candidate:', error);
        }
    });
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
                    .catch(error => console.error('Error pushing answer ICE candidate:', error));
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
        throw error;
    }
}