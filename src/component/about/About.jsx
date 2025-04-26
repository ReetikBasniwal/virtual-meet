import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../server/AuthContext';
import { push, ref, set } from 'firebase/database';
import { db } from '../../server/firebase';
// import { createBrowserHistory } from 'history';

function About() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();


  const handleStartMeeting = () => {
    const roomsRef = ref(db, 'rooms'); // Reference to the 'rooms' node in the database
    // Push a new room under 'rooms' to generate a unique room ID
    const newRoomRef = push(roomsRef);
    const roomId = newRoomRef.key; 
    // Set initial room data if needed

    set(newRoomRef, {
      createdAt: new Date().toISOString(),
      // Add any additional initial data for the room
    }).then(() => {
      // Navigate to the new room URL
      navigate(`/roomId/${roomId}`);
    }).catch((error) => {
      console.error("Error creating room: ", error);
    });
    // navigate("/roomId/" + roomId);
  }

  return (
    <>
      <div className='flex mx-10 items-center justify-center h-full w-full overflow-hidden'>
        <div className='flex items-center flex-col'>
          {currentUser && <span className='text-blue-400 italic text-4xl'>Hi {currentUser.firstName} !</span>}
          <span className='text-center text-blue-400 italic text-3xl'>Empower face-to-face connections from anywhere with V Meet!</span>
          {!currentUser && <Link className='rounded pt-1 pb-1 pr-2 pl-2 mt-6 text-2xl font-medium bg-blue-300 w-fit text-slate-600' to='/sign-up'>Sign Up</Link>}
          {currentUser && <button className='rounded pt-1 pb-1 pr-2 pl-2 mt-6 text-2xl font-medium bg-slate-300 w-fit text-slate-600' onClick={handleStartMeeting}>Start a meet</button>}
        </div>
      </div>
    </>
  )
}

export default About
