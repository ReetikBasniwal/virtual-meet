import { child, getDatabase, push, ref, set, update } from "firebase/database"
import { db } from "./firebase"

export let dbRef = ref(db);
export const startMeeting = () => {
    // let dbRef = ref(db);

    const urlParams = new URLSearchParams(window.location.search);
    let roomId = urlParams.get("id");

    if(roomId){
        dbRef = child(dbRef, roomId);
        console.log("existing");
    }else {
        dbRef = push(dbRef, `/${dbRef.key}`);
        roomId = dbRef.key;
        window.history.replaceState(null, "v-meet", "?id=" + roomId);
        console.log("new", roomId);
    }
    return roomId;
}