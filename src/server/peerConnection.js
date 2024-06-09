import { child, push, ref, set } from "firebase/database";
import { db } from "./firebase";

const dbRef = ref(db);

export const createOffer = async (peerConnection, createdId, receiverId, id) => {
    
    const participantsRef = child(dbRef, `rooms/${id}/participants`);
    const receiverRef = child(participantsRef, `/${receiverId}`);
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    const offerPayload = {
        sdp: offer.sdp,
        type: offer.type,
        userId: createdId
    }

    let offerRef = await push(receiverRef, `/offers`);
    await set(offerRef, { offerPayload });
}