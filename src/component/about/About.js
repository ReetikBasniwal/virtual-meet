import React from 'react'

function About() {
  return (
    <div className='flex mx-10 items-center justify-center h-full w-full overflow-hidden'>
      <div className='flex items-center flex-col'>
        <span className=' text-center text-blue-400 italic text-4xl'>Empower face-to-face connections from anywhere with V Meet!</span>
        <button className='rounded pt-1 pb-1 pr-2 pl-2 mt-6 text-2xl font-medium bg-blue-300 w-fit text-slate-600'>Sign Up</button>
      </div>
    </div>
  )
}

export default About
