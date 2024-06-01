import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../server/AuthContext';
import { child, get, onChildAdded, onChildRemoved, onDisconnect, onValue, push, ref, update } from 'firebase/database';
import { db } from '../../server/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { roomActions } from '../../redux/reducers/actionreducer';
// import { dbRef } from '../../server/createOrJoinRoom';

export default function Room() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { currentUser } = useContext(AuthContext);
    const dispatch = useDispatch();

    const { user, participants } = useSelector(state => state.roomReducer);

    const dbRef = ref(db);
    const roomRef = ref(db, `rooms/${id}`);
    const participantsRef = child(dbRef, `rooms/${id}/participants`);

    useEffect(() => {
        if(!currentUser){
            navigate('/sign-in');
        }else {
            setLoading(false);
        }
        console.log("room")

    }, [currentUser, navigate])

    useEffect(() => {
      if(!id || !currentUser) return;

      const addUserInTheRoom = async () => {
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

            const newParticipantRef = push(participantsRef);
            // const participantKey = newParticipantRef.key;
            await update(newParticipantRef, participantData);
            dispatch(roomActions.setUser({
              [newParticipantRef.key]: {
                userName: participantData.userName,
                ...defaultPreferences,
              }
            }))
            console.log("Participant added");
            
            onDisconnect(newParticipantRef).remove().then(() => {
              console.log("onDisconnect set to remove participant");
            }).catch(error => {
              console.error("Error setting onDisconnect: ", error);
            });
          }else {
            navigate(`/v-meet/roomId/${id}/noroom`);
          }
        } catch {
          navigate('/v-meet/error/:room');
        }
      };
  
      addUserInTheRoom();

    },[id, currentUser])

    useEffect(() => {
      if(!user) return;

      const unsubscribeonChildAdded = onChildAdded(participantsRef, (snapshot) => {
        const participantData = snapshot.val();
        dispatch(roomActions.addParticipant({
          [snapshot.key]: {
            userName: participantData.userName,
            ...participantData.preference
          }
        }));
      });

      const unsubscribeonChildRemoved = onChildRemoved(participantsRef, (snapshot) => {
        const participantData = snapshot.val();
        dispatch(roomActions.removeParticipant({ participantKey: snapshot.key }));
      });

      return () => { 
        unsubscribeonChildAdded();
        unsubscribeonChildRemoved();
      }        

    },[user])

  if(loading){
      return <span className='text-white'>Loading....</span>
  }

  return (
    <div className='w-screen h-screen bg-white border-2 border-rose-500'>
      {JSON.stringify(user)} {JSON.stringify(participants)}
    </div>
  )
}
