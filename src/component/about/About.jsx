import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../server/AuthContext';
import { push, ref, set } from 'firebase/database';
import { db } from '../../server/firebase';
// import { createBrowserHistory } from 'history';

function About() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const generateReadableRoomId = () => {
    const getRandomSegment = () => Math.floor(100 + Math.random() * 900); // 3-digit number
    return `${getRandomSegment()}-${getRandomSegment()}-${getRandomSegment()}`;
  };

  const handleStartMeeting = () => {
    // Push a new room under 'rooms' to generate a unique room ID
    const roomId = generateReadableRoomId();
    const newRoomRef = ref(db, 'rooms/$roomId');
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
      <div className='flex items-center justify-center h-full w-full overflow-hidden'>
        <div className='flex items-center flex-col'>
          {currentUser && <span className='text-gray-600 dark:text-gray-300 italic text-4xl'>Hi {currentUser.firstName} !</span>}
          <span className='mt-4 text-center text-gray-600 dark:text-gray-300 italic text-3xl'>Empower face-to-face connections from anywhere with V Meet!</span>
          {!currentUser && <Link className='mt-4 font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 bg-sky-800 text-white hover:bg-sky-700 focus:ring-primary-300 text-base px-5 py-2.5 gap-2.5 flex-1' to='/sign-up'>Sign up</Link>}
          {currentUser && <button className='cursor-pointer mt-4 font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 bg-sky-800 text-white hover:bg-sky-700 focus:ring-primary-300 text-base px-5 py-2.5 gap-2.5 flex-1' onClick={handleStartMeeting}>Start a meeting</button>}
        </div>
      </div>
    </>
  )
}

export default About
