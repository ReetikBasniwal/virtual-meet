import { child, getDatabase, push, ref, set, update } from "firebase/database"
import { db } from "./firebase"

export let dbRef = ref(db);
  
export const startMeeting = () => {

    const urlParams = new URLSearchParams(window.location.search);
    let roomId = urlParams.get("id");

    if(roomId){
        dbRef = child(dbRef, roomId);
        console.log("existing");
    }else {
        const meetData = {
            participants: {

            }
        }
        const newPostKey = push(child(dbRef, 'meetings')).key;
        // const updates = {};
        // updates['/meetings/' + newPostKey] = meetData;
        roomId = newPostKey;
        window.history.replaceState(null, "v-meet", "?id=" + roomId);
        // update(dbRef, updates);
        writeMeetingData(roomId);
        console.log("new");
    }
    return roomId;
}

function writeMeetingData(roomId) {
    set(ref(db, 'meeting/' + roomId), {
      participants:{}
    });
}