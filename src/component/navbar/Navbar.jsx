import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../server/AuthContext';
import SignOut from '../signOut/SignOut';
import { useSelector } from 'react-redux';


function Navbar() {

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
        <nav className="flex items-center justify-between mt-2 mr-2 ml-2" style={{background: '#282c34'}}>
          <div className='text-4xl text-blue-400'>V Meet</div>
          <div className='flex items-center'>
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
