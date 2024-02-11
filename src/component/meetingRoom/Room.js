import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Room({user}) {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!user){
            navigate('/v-meet/sign-in');
        }else {
            setLoading(false);
        }
        console.log("room")

    }, [user, navigate])

    if(loading){
        return <span className='text-white'>Loading....</span>
    }

  return (
    <div className='w-screen h-screen bg-white'>
      {user?.firstName}
    </div>
  )
}
