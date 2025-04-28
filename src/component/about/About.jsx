import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../server/AuthContext';
import { push, ref, set } from 'firebase/database';
import { db } from '../../server/firebase';
// import { createBrowserHistory } from 'history';

function About() {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [meetingId, setMeetingId] = React.useState("");


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
  const joinMeeting = () => {
    if(meetingId.trim().length === 0){
      return;
    }
    navigate("/roomId/" + meetingId);
  }

  return (
    <>
      <div className='flex items-center justify-center h-full w-full overflow-hidden'>
        <div className='flex items-center flex-col w-4xl'>
          {currentUser && <span className='text-gray-600 dark:text-gray-300 italic text-4xl'>Hi {currentUser.firstName} !</span>}
          <span className='mt-4 text-center text-gray-600 dark:text-gray-300 italic text-2xl font-normal'>Premium video meetings for everyone. V Meet makes connecting with others simple and seamless with enterprise-grade video conferencing.</span>
          {!currentUser && <Link className='mt-4 font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 bg-sky-800 text-white hover:bg-sky-700 focus:ring-primary-300 text-base px-5 py-2.5 gap-2.5 flex-1' to='/sign-up'>Sign up</Link>}
          {currentUser && <div className="flex flex-col mt-4 sm:flex-row gap-4 mb-6 sm:mb-8 items-center">
              <button className='cursor-pointer font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 bg-sky-800 text-white hover:bg-sky-700 focus:ring-primary-300 text-base px-5 py-2.5 gap-2.5 flex-1' onClick={handleStartMeeting}>Start a meeting</button>
              <div className="flex flex-1 gap-2 w-full">
                <input
                  type="text"
                  placeholder="Enter meeting code"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  className="flex-1 min-w-0 px-4 py-2.5 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
                <button 
                  onClick={() => joinMeeting()}
                  className="flex-shrink-0 font-medium cursor-pointer transition-all duration-200 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-800 text-sm px-6 py-1.5 gap-1.5"
                >
                  Join
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </>
  )
}

export default About
