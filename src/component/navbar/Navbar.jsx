import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../server/AuthContext';
import SignOut from '../signOut/SignOut';
import { useSelector } from 'react-redux';
import { IoSunnyOutline } from "react-icons/io5";
import { LuMoon } from "react-icons/lu";


function Navbar({ isDarkMode, toggleDarkMode }) {

  const [currentTime, setCurrentTime] = React.useState("");
  const { currentUser } = useContext(AuthContext);
  const [signOut, setShowSignOut] = useState(false);

  const { isActiveRoom } = useSelector((state) => state.roomReducer);

  useEffect(()=>{

    const timeInterval =  setInterval(()=>{
      const now = new Date();

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;

      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
      const monthName = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][now.getMonth()];
      const dayNum = now.getDate();
      // Add leading zero to minutes if needed
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
        setCurrentTime(`${formattedHours}:${formattedMinutes} ${ampm} ${dayName}, ${monthName} ${dayNum}`);
        },100
    )
    return ()=>{
        clearInterval(timeInterval)
    }
  },[])

  return (
    <>
      {isActiveRoom ? <></> : (
        <>
        <nav className="flex items-center justify-between p-2 bg-white/80 dark:bg-gray-900/80">
          <div className='text-4xl text-blue-900 dark:text-blue-400'>V Meet</div>
          <div className='flex items-center gap-4'>
            <button
              onClick={toggleDarkMode}
              className=" cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <IoSunnyOutline className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <LuMoon className="w-5 h-5 text-gray-500" />
              )}
            </button>
            <div className='text-xl text-blue-400 mr-4'>{currentTime}</div>

            {/* USER LOGO */}
            {
              currentUser && <div className='flex items-center justify-center text-white bg-slate-600 border rounded-2xl border-sky-500 cursor-pointer' 
                                  style={{width: '2em', height: '2em'}}  onClick={() => setShowSignOut(true)}>
                <span>{currentUser.firstName[0].toUpperCase()}</span>
              </div>
            }
          </div>
        </nav>
        {currentUser && signOut && <SignOut userName={currentUser.firstName +" " + currentUser.lastName} setShowSignOut={setShowSignOut}/>}
        </>
      )}
    </>
    
  )
}

export default Navbar;
