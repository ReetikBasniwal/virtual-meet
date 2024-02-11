import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../server/AuthContext';
import { startMeeting } from '../../server/createOrJoinRoom';
// import { createBrowserHistory } from 'history';

function About() {
  const { currentUser } = useContext(AuthContext);
  // let history = createBrowserHistory();
  const navigate = useNavigate();
  console.log(currentUser, "fname")

  const handleStartMeeting = () => {
    const roomId = startMeeting();
    navigate(`/v-meet/roomId/${roomId}`);
  }

  return (
    <>
      <div className='flex mx-10 items-center justify-center h-full w-full overflow-hidden'>
        <div className='flex items-center flex-col'>
          {currentUser && <span className='text-blue-400 italic text-4xl'>Hi {currentUser.firstName} !</span>}
          <span className='text-center text-blue-400 italic text-3xl'>Empower face-to-face connections from anywhere with V Meet!</span>
          {!currentUser && <Link className='rounded pt-1 pb-1 pr-2 pl-2 mt-6 text-2xl font-medium bg-blue-300 w-fit text-slate-600' to='/v-meet/sign-up'>Sign Up</Link>}
          {currentUser && <button className='rounded pt-1 pb-1 pr-2 pl-2 mt-6 text-2xl font-medium bg-slate-300 w-fit text-slate-600' onClick={handleStartMeeting}>Start a meet</button>}
        </div>
      </div>
    </>
  )
}

export default About
