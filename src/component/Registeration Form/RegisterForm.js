import React from 'react'

function RegisterForm() {
  return (
    <div className="absolute bg-slate-500/50 flex top-0 items-center justify-center h-full w-full bg-white">
        <div className='visible p-4 bg-sky-200 rounded-lg' style={{width: '30em', height: '40em'}}>
            <div className='p-5 flex items-center justify-center'>
                <span className='text-xl font-semibold'>Create a new account</span>
            </div>
            <hr />
            <div className="flex p-8 flex-col items-center justify-center">
                <label className='text-md p-2 font-medium' htmlFor="">First Name</label>
                <input className='border pl-2 pr-2 w-full h-10' type="text" />
                <label className='text-md p-2 font-medium' htmlFor="">Last Name</label>
                <input className='border pl-2 pr-2 w-full h-10' type="text" />
                <label className='text-md p-2' htmlFor="">Email</label>
                <input className='border pl-2 pr-2 w-full h-10' type="text" />
                <label className='text-md p-2 font-medium' htmlFor="">Password</label>
                <input className='border pl-2 pr-2 w-full h-10' type="text" />
                <label className='text-md p-2 font-medium' htmlFor="">Confirm Password</label>
                <input className='border pl-2 pr-2 w-full h-10' type="text" />
                <button className='border rounded-lg mt-6 pl-4 pr-4 pb-2 pt-2 bg-cyan-700 text-white text-2xl w-fit' >Sign Up</button>
            </div>
        </div>
    </div>

  )
}

export default RegisterForm
