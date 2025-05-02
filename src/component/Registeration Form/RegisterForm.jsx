import React, { useContext, useEffect, useState } from 'react'
import { isValidEmail } from '../../utils/emailValidator';
import 'react-toastify/dist/ReactToastify.css';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../../server/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../server/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import { writeUserData } from '../../server/createUser';
import { CgClose } from "react-icons/cg";

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
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className='visible flex flex-col p-2 bg-white dark:bg-gray-800 rounded-lg' onClick={(e) => e.stopPropagation()} style={{ width: '30em', height: '38em' }}>
                    <div className='p-2 flex items-start justify-between'>
                        <div className="flex flex-col justify-center">
                            <span className='text-2xl font-semibold'>Create a new account</span>
                            <span className='text-sm'>Please enter the following details</span>
                        </div>

                        <CgClose size={22} onClick={() => { navigate('/'); }} className="mt-1 cursor-pointer  text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"/>
                    </div>
                    <form className="flex p-2 flex-col justify-center" onSubmit={(ev) => { ev.preventDefault(); }}>
                        <label className='text-sm pb-1 font-medium text-gray-700 dark:text-gray-300' htmlFor="firstname">First Name</label>
                        <input
                            className='border border-gray-300 rounded-lg pl-2 pr-2 mb-4 w-full h-10 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300'
                            name="firstname" type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            autoComplete='on'
                        />
                        <label className='text-sm pb-1 font-medium text-gray-700 dark:text-gray-300' htmlFor="lastname">Last Name</label>
                        <input
                            className='border border-gray-300 rounded-lg pl-2 pr-2 mb-4 w-full h-10 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300'
                            name="lastname" type="text"
                            value={lastName}
                            onChange={(e) => setLasttName(e.target.value)}
                            required
                            autoComplete='on'
                        />
                        <label className='text-sm pb-1' htmlFor="email">Email</label>
                        <input
                            className='border border-gray-300 rounded-lg pl-2 pr-2 mb-4 w-full h-10 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300'
                            name='email' type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete='off'
                        />
                        <label className='text-sm pb-1 font-medium text-gray-700 dark:text-gray-300' htmlFor="passowrd">Password</label>
                        <input
                            className='border border-gray-300 rounded-lg pl-2 pr-2 mb-4 w-full h-10 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300'
                            name='password' type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete='off'
                        />
                        <label className='text-sm pb-1 font-medium text-gray-700 dark:text-gray-300' htmlFor="confpassword">Confirm Password</label>
                        <input
                            className='border border-gray-300 rounded-lg pl-2 pr-2 mb-4 w-full h-10 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-300'
                            name='confpassword' type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete='off'
                        />
                        <button className='cursor-pointer font-medium transition-all duration-200 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 bg-blue-900 text-white hover:bg-blue-950 focus:ring-blue-300 text-sm px-4 py-2 gap-2 w-full' onClick={(e) => { e.preventDefault(); handleSubmit() }}>Sign up</button>
                    </form>
                    <div className='flex items-center justify-center h-full w-full text-sm'>
                        <span className='text-gray-600 dark:text-gray-400'>Already have an account? <Link className="border-b border-sky-500 text-sky-500" to="/sign-in">Sign in</Link></span>
                    </div>
                </div>
            </div>
            <ToastContainer autoClose={2000}/>
        </>

    )
}

export default RegisterForm
