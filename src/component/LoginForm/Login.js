import 'react-toastify/dist/ReactToastify.css';
import React, { useContext, useEffect, useState } from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../server/firebase';
import { isValidEmail } from '../../utils/emailValidator';
import { AuthContext } from '../../server/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';

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
      console.log(currentUser, 'userrrr...')
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
      <div className="absolute bg-sky-900/75 flex top-0 items-center justify-center h-full w-full">
          <div className='visible p-4 bg-sky-200 rounded-lg' style={{width: '30em', height: '20em'}}>
              <form className="flex p-8 flex-col items-center justify-center" onSubmit={(e) => e.preventDefault()}>
                  <label className='text-md p-2 font-medium' htmlFor="email">Email</label>
                  <input 
                      className='border pl-2 pr-2 w-full h-10 rounded-md' 
                      type="email" name='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                  />
                  <label 
                      className='text-md p-2 font-medium'
                      htmlFor="passwrd">Password</label>
                  <input 
                    className='border pl-2 pr-2 w-full h-10 rounded-md' 
                    name='passwrd' type="password" autoComplete='off'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button className='border rounded-lg mt-6 pl-4 pr-4 pb-2 pt-1 bg-cyan-700 text-white text-2xl w-fit' onClick={handleSignIn}>Sign in</button>
              </form>
          </div>
      </div>
      <ToastContainer autoClose={2000}/>
    </>
  )
}

export default Login
