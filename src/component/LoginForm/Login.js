import React, { useState } from 'react'

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

  return (
    <div className="absolute bg-sky-900/75 flex top-0 items-center justify-center h-full w-full bg-white">
        <div className='visible p-4 bg-sky-200 rounded-lg' style={{width: '30em', height: '20em'}}>
            <div className="flex p-8 flex-col items-center justify-center">
                <label className='text-md p-2 font-medium' htmlFor="">Email</label>
                <input className='border pl-2 pr-2 w-full h-10' type="email" />
                <label className='text-md p-2 font-medium' htmlFor="">Password</label>
                <input className='border pl-2 pr-2 w-full h-10' type="password" />
                <button className='border rounded-lg mt-6 pl-4 pr-4 pb-2 pt-2 bg-cyan-700 text-white text-2xl w-fit' >Sign in</button>
            </div>
        </div>
    </div>
  )
}

export default Login
