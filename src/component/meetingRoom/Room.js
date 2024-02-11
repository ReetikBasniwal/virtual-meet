import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { child, onValue, push, update } from 'firebase/database';
import { connectedRef, } from '../../server/firebase';
import { dbRef } from '../../server/createOrJoinRoom';

export default function Room({user}) {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!user){
            navigate('/v-meet/sign-in');
        }else {
            setLoading(false);
        }
        console.log("room")

    }, [user, navigate])

    useEffect(() => {
      const participantsRef = child(dbRef, "participants");
      console.log(participantsRef, "reff")
      onValue(connectedRef, (snapshot) => {
        if(snapshot.val()){
          const defaultPrefernces = {
            audio: true,
            video: false,
            screen: false,
          }
          const participantData = {
            userName: user.firstName + user.lastName,
            uid: user.uid,
            preference: defaultPrefernces
          };
          const newParticipantkey = push(participantsRef).key;
          const updates = {};
          updates[newParticipantkey] = participantData;
          update(participantsRef, updates);
          console.log("update")
        }
      })
    },[])

  if(loading){
      return <span className='text-white'>Loading....</span>
  }

  return (
    <div className='w-screen h-screen bg-white'>
      {user?.firstName}
    </div>
  )
}
