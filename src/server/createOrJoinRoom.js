import { child, push, ref } from "firebase/database"
export const startMeeting = async (currentUser) => {
    // let dbRef = ref(db);

    const urlParams = new URLSearchParams(window.location.search);
    let roomId = urlParams.get("id");
    console.log("room id", roomId);
    if(roomId){
        dbRef = child(dbRef, `/${roomId}`);
        console.log("existing")
    }else {
        dbRef = push(dbRef, `/${dbRef.key}`);
        roomId = dbRef.key;
    }
    return roomId;
}