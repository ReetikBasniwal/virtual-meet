import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../server/AuthContext';

function About() {
  const { currentUser } = useContext(AuthContext);

  return (
    <>
      <div className='flex mx-10 items-center justify-center h-full w-full overflow-hidden'>
        <div className='flex items-center flex-col'>
          {currentUser && <span className='text-blue-400 italic text-4xl'>Hi {currentUser.firstName} !</span>}
          <span className='text-center text-blue-400 italic text-3xl'>Empower face-to-face connections from anywhere with V Meet!</span>
          {!currentUser && <Link className='rounded pt-1 pb-1 pr-2 pl-2 mt-6 text-2xl font-medium bg-blue-300 w-fit text-slate-600' to='/v-meet/sign-up'>Sign Up</Link>}
          {currentUser && <button className='rounded pt-1 pb-1 pr-2 pl-2 mt-6 text-2xl font-medium bg-slate-300 w-fit text-slate-600' >Start a meet</button>}
        </div>
      </div>
    </>
  )
}

export default About
