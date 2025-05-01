import React, { useContext, useEffect, useState } from 'react'
import { isValidEmail } from '../../utils/emailValidator';
import 'react-toastify/dist/ReactToastify.css';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../server/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../server/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import { writeUserData } from '../../server/createUser';
import { onValue, ref } from 'firebase/database';

function RegisterForm() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLasttName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    // const [error, setError] = useState("");

    useEffect(() => {
        if (currentUser) {
            console.log(currentUser, "user in regis")
             // eslint-disable-next-line
            navigate('/');
        }
    }, [currentUser, navigate])
    // const auth = getAuth();

    const handleSubmit = async () => {
        if (firstName.trim().length === 0) {
            // setError("noFirstName");
            toast.error("Please enter first name", {
                position: 'bottom-left'
            })
            return;
        }
        if (lastName.trim().length === 0) {
            toast.error("Please enter last name", {
                position: 'bottom-left'
            })
            return;
        }
        if(email.trim().length === 0){
            toast.error("Please enter email", {
                position: 'bottom-left'
            })
            return;
        }
        if (!isValidEmail(email)) {
            toast.error("Please enter a valid email", {
                position: 'bottom-left'
            })
            return;
        }
        if (password.trim().length === 0 || password.trim().length < 8) {
            toast.error("Password should conatin at least 8 characters", {
                position: 'bottom-left'
            })
            return;
        }
        if (password !== confirmPassword) {
            toast.error("Password and confirm ", {
                position: 'bottom-left'
            })
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user) {
                // Write user data to the database
                await writeUserData(user.uid, firstName, lastName, email);

                toast.success("Successfully signed up!", { position: 'top-right' });

                // Clear form fields
                setFirstName('');
                setLasttName('');
                setPassword('');
                setConfirmPassword('');
                setEmail('');

                navigate('/');
                window.location.reload();
            }
        } catch (error) {
            console.error("Error during sign-up:", error.message);
            toast.error("Sign-up failed. Please try again.", { position: 'bottom-left' });
        }
    }

    return (
        <>
            <div className="absolute bg-sky-900/50 flex top-0 items-center justify-center h-full w-full" onClick={() => { navigate('/'); }}>
                <div className='visible flex flex-col p-2 bg-sky-200 rounded-lg' onClick={(e) => e.stopPropagation()} style={{ width: '30em', height: '45em' }}>
                    <div className='p-4 flex flex-col items-center justify-center'>
                        <span className='text-xl font-semibold'>Create a new account</span>
                        <span>Please enter the following details</span>
                    </div>
                    <hr className='border-slate-400' />
                    <form className="flex p-8 flex-col items-center justify-center" onSubmit={(ev) => { ev.preventDefault(); }}>
                        <label className='text-md p-2 font-medium' htmlFor="firstname">First Name</label>
                        <input
                            className='border rounded pl-2 pr-2 w-full h-10'
                            name="firstname" type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            autoComplete='on'
                        />
                        <label className='text-md p-2 font-medium' htmlFor="lastname">Last Name</label>
                        <input
                            className='border rounded pl-2 pr-2 w-full h-10'
                            name="lastname" type="text"
                            value={lastName}
                            onChange={(e) => setLasttName(e.target.value)}
                            required
                            autoComplete='on'
                        />
                        <label className='text-md p-2' htmlFor="email">Email</label>
                        <input
                            className='border rounded pl-2 pr-2 w-full h-10'
                            name='email' type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete='off'
                        />
                        <label className='text-md p-2 font-medium' htmlFor="passowrd">Password</label>
                        <input
                            className='border rounded pl-2 pr-2 w-full h-10'
                            name='password' type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete='off'
                        />
                        <label className='text-md p-2 font-medium' htmlFor="confpassword">Confirm Password</label>
                        <input
                            className='border rounded pl-2 pr-2 w-full h-10'
                            name='confpassword' type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete='off'
                        />
                        <button className='border rounded-lg mt-6 pl-4 pr-4 pb-2 pt-2 bg-cyan-700 text-white text-2xl w-fit' onClick={(e) => { e.preventDefault(); handleSubmit() }}>Sign up</button>
                    </form>
                    <hr className='border-slate-400' />
                    <div className='flex items-center justify-center h-full w-full'>
                        <span className=''>Already have an account? <Link className="border-b border-sky-500 text-sky-500" to="/sign-in">Sing in</Link></span>
                    </div>
                </div>
            </div>
            <ToastContainer autoClose={2000}/>
        </>

    )
}

export default RegisterForm
