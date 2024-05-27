import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../server/AuthContext';
import { child, get, onValue, push, ref, update } from 'firebase/database';
import { db } from '../../server/firebase';
// import { dbRef } from '../../server/createOrJoinRoom';

export default function Room({user}) {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { currentUser } = useContext(AuthContext);
    useEffect(() => {
        if(!currentUser){
            navigate('/v-meet/sign-in');
        }else {
            setLoading(false);
        }
        console.log("room")

    }, [currentUser, navigate])

    useEffect(() => {
      if(!id || !currentUser) return;
      let dbRef = ref(db);
      const roomRef = ref(db, `rooms/${id}`);
      const participantsRef = child(dbRef, `rooms/${id}/participants`);

      const addParticipant = async () => {
        try { 
          const roomSnapshot = await get(roomRef);
          console.log(roomSnapshot, 'snap')
          if (roomSnapshot.exists()) {
            const defaultPreferences = {
              audio: true,
              video: false,
              screen: false,
            };
      
            const participantData = {
              userName: `${currentUser.firstName} ${currentUser.lastName}`,
              uid: currentUser.uid,
              preference: defaultPreferences,
            };
      
            const newParticipantKey = push(participantsRef).key;
            const updates = {};
            updates[newParticipantKey] = participantData;
            update(participantsRef, updates);
            console.log("Participant added");
          }else {
            navigate(`/v-meet/roomId/${id}/noroom`);
          }
        } catch {
          navigate('/v-meet/error/:room');
        }
      };
  
      const unsubscribe = onValue(participantsRef, (snapshot) => {
        if (snapshot.exists()) {
          // will remove the user from the room
        } else {
          // 
        }
      });
  
      addParticipant();
  
      return () => {
        unsubscribe();
      };
    },[id, currentUser.firstName, currentUser.lastName, currentUser.uid])

  if(loading){
      return <span className='text-white'>Loading....</span>
  }

  return (
    <div className='w-screen h-screen bg-white border-2 border-rose-500'>
      {currentUser?.firstName}
    </div>
  )
}
