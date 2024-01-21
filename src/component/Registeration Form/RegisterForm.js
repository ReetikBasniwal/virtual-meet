import React, { useState } from 'react'
import { isValidEmail } from '../../utils/emailValidator';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../server/firebase';
import { redirect } from 'react-router-dom';

function RegisterForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLasttName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    // const auth = getAuth();

    const handleSubmit = () => {
        if(firstName.trim().length === 0) {
            setError("noFirstName");
            return;
        }
        if(lastName.trim().length === 0) {
            setError("nolastName");
            return;
        }
        if(!isValidEmail(email)){
            setError("email");
            return;
        }
        if(lastName.trim().length === 0 || lastName.trim().length < 8) {
            setError("8digit");
            return;
        }
        if(password !== confirmPassword){
            setError("passMatched")
            return;
        }

        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            console.log(user, "user")
            if(user){
                setFirstName('');
                setLasttName('');
                setPassword('');
                setConfirmPassword('');
                setEmail('');
                return redirect('/v-meet/sign-in');
            }

        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
            console.log(errorCode, errorMessage);
        });
    }

  return (
    <div className="absolute bg-sky-900/50 flex top-0 items-center justify-center h-full w-full bg-white">
        <div className='visible p-4 bg-sky-200 rounded-lg' style={{width: '30em', height: '45em'}}>
            <div className='p-5 flex flex-col items-center justify-center'>
                <span className='text-xl font-semibold'>Create a new account</span>
                <span>Please enter the following details</span>
            </div>
            <hr />
            <form className="flex p-8 flex-col items-center justify-center" onSubmit={(ev) => {ev.preventDefault();}}>
                <label className='text-md p-2 font-medium' htmlFor="firstname">First Name</label>
                <input 
                    className='border pl-2 pr-2 w-full h-10'
                    name="firstname" type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    autoComplete='on'
                />
                <label className='text-md p-2 font-medium' htmlFor="lastname">Last Name</label>
                <input 
                    className='border pl-2 pr-2 w-full h-10' 
                    name="lastname" type="text" 
                    value={lastName}
                    onChange={(e) => setLasttName(e.target.value)}
                    required
                    autoComplete='on'
                />
                <label className='text-md p-2' htmlFor="email">Email</label>
                <input 
                    className='border pl-2 pr-2 w-full h-10' 
                    name='email' type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete='off'
                />
                <label className='text-md p-2 font-medium' htmlFor="passowrd">Password</label>
                <input 
                    className='border pl-2 pr-2 w-full h-10' 
                    name='password' type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete='off'
                />
                <label className='text-md p-2 font-medium' htmlFor="confpassword">Confirm Password</label>
                <input 
                    className='border pl-2 pr-2 w-full h-10' 
                    name='confpassword' type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    autoComplete='off'
                />
                <button className='border rounded-lg mt-6 pl-4 pr-4 pb-2 pt-2 bg-cyan-700 text-white text-2xl w-fit' onClick={(e) => {e.preventDefault(); handleSubmit()}}>Sign Up</button>
            </form>
        </div>
    </div>

  )
}

export default RegisterForm
