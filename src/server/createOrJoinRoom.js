import { child, push, ref } from "firebase/database"
import { db } from "./firebase"

export const startMeeting = () => {
    let dbRef = ref(db);

    const urlParams = new URLSearchParams(window.location.search);

    const roomId = urlParams.get("id");

    if(roomId){
        dbRef = child(dbRef, roomId);
    }else {
        const newRoomId = push(child(dbRef, '')).key;
        window.history.replaceState(null, "v-meet", "?id=" + dbRef.key);
    }
}