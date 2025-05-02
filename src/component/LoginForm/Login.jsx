import 'react-toastify/dist/ReactToastify.css';
import React, { useContext, useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../server/firebase';
import { isValidEmail } from '../../utils/emailValidator';
import { AuthContext } from '../../server/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { CgClose } from 'react-icons/cg';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
      if(currentUser){
        console.log(currentUser);
        // eslint-disable-next-line
        navigate('/');
      }
    },[currentUser, navigate])
    
    const handleSignIn = () => {
      if(!isValidEmail(email)){
        console.log("wrong email")
        return;
      }

      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        toast.success("Successfully loged in!", {
          position: 'top-right'
        })
        console.log(user)
        navigate('/');
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error("Invalid email or password", {
          position: 'bottom-left'
        })
        console.log("Error: ", errorCode +" "+errorMessage)
      });

    }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className='visible flex flex-col mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg' onClick={(e) => e.stopPropagation()} style={{width: '30em', height: '22em'}}>
              <div className='p-2 flex justify-between'>
                <span className='text-2xl font-semibold'>Welcome back</span>
                <CgClose size={22} onClick={() => { navigate('/'); }} className="mt-1 cursor-pointer  text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"/>
              </div>
              <form className="flex p-2 flex-col justify-center" onSubmit={(e) => e.preventDefault()}>
                  <label className='text-sm pb-1 font-medium text-gray-700 dark:text-gray-300' htmlFor="email">Email</label>
                  <input 
                    className='border border-gray-300 rounded-lg pl-2 pr-2 mb-4 w-full h-10 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300' 
                    type="email" name='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label className='text-sm pb-1 font-medium text-gray-700 dark:text-gray-300' htmlFor="passwrd">Password</label>
                  <input 
                    className='border border-gray-300 rounded-lg pl-2 pr-2 mb-4 w-full h-10 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300' 
                    name='passwrd' type="password" autoComplete='off'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button className='cursor-pointer font-medium transition-all duration-200 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-900 text-white hover:bg-blue-950 focus:ring-blue-300 text-sm px-4 py-2 gap-2 w-full' onClick={handleSignIn}>Sign in</button>
              </form>
              <div className='flex items-center justify-center h-full w-full'>
                  <span className='text-gray-600 dark:text-gray-400'>Don't have an account? <Link className="border-b border-sky-500 text-sky-500" to="/sign-up">Sign up</Link></span>
              </div>
          </div>
      </div>
      <ToastContainer autoClose={2000}/>
    </>
  )
}

export default Login
