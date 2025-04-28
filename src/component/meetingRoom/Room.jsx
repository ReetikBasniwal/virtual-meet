import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../server/AuthContext';
import { child, get, onChildAdded, onChildRemoved, onDisconnect, push, ref, onValue, update } from 'firebase/database';
import { db } from '../../server/firebase';
import { useDispatch, useSelector } from 'react-redux';
import { initializeRoom, roomActions } from '../../redux/reducers/actionreducer';
import MainScreen from './MainScreen/MainScreen';
// import { dbRef } from '../../server/createOrJoinRoom';

export default function Room() {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const { currentUser } = useContext(AuthContext);
    const dispatch = useDispatch();

    const dbRef = ref(db);
    const roomRef = ref(db, `rooms/${id}`);
    const participantsRef = child(dbRef, `rooms/${id}/participants`);
    const connectedRef = ref(db, ".info/connected");
    const mainStream = useSelector(state => state.roomReducer.mainStream);
    
    useEffect(() => {
        if(!currentUser){
            navigate('/sign-in');
        }
        dispatch(roomActions.setRoomId(id));
        // eslint-disable-next-line
    }, [currentUser, navigate, dispatch])

    useEffect(() => {
      if(!id || !currentUser) return;
      navigator.mediaDevices.getUserMedia({ audio: true, video: {facingMode: 'user'} }).then(mediaStream => {
        // mediaStream.getVideoTracks()[0].enabled = false;
        dispatch(roomActions.setMainStream(mediaStream))
        // console.log(mediaStream, "media stream")
      }).catch((error) => {
        console.error(error, " permission denied for media")
      })

      let newParticipantRef = null;

      onValue(connectedRef, async (snap) => {
        if (snap.val() === true) {
          try { 
            const roomSnapshot = await get(roomRef);
            if (roomSnapshot.exists()) {
              const defaultPreferences = {
                audio: true,
                video: true,
                screen: false,
              };
        
              const participantData = {
                userName: `${currentUser.firstName} ${currentUser.lastName}`,
                uid: currentUser.uid,
                preference: defaultPreferences,
              };
  
              newParticipantRef = await push(participantsRef);

              await update(newParticipantRef, participantData);
              dispatch(roomActions.setUser({
                [newParticipantRef.key]: {
                  userName: participantData.userName,
                  ...defaultPreferences,
                }
              }))
              dispatch(initializeRoom({ userId: newParticipantRef.key, roomId: id }));

              setLoading(false);
  
              dispatch(roomActions.setisRoomActive(true));

              onDisconnect(newParticipantRef).remove().then(() => {
                console.log("onDisconnect set to remove participant");
              }).catch(error => {
                console.error("Error setting onDisconnect: ", error);
              });
              
  
            }else {
              navigate(`/roomId/${id}/noroom`);
            }
          } catch(error) {
            console.error(error, "error");
            navigate('/error/:room');
          }
        } else {
          console.log("not connected");
        }
      });

      return () => {
        dispatch(roomActions.setisRoomActive(false));
      }

      // eslint-disable-next-line
    },[id, currentUser, dispatch, navigate ])

    useEffect(() => {
      if(!mainStream) return;

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
        dispatch(roomActions.removeParticipant({ participantKey: snapshot.key }));
      });

      return () => { 
        unsubscribeonChildAdded();
        unsubscribeonChildRemoved();
      }

    },[mainStream, dispatch, navigate, participantsRef])

  if(loading){
      return <span className='text-white'>Loading....</span>
  }

  return (
    <div className='w-screen h-screen'>
      {/* {JSON.stringify(user)} {JSON.stringify(participants)} */}
      <MainScreen />
    </div>
  )
}
