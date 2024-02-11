import { signOut } from 'firebase/auth';
import React from 'react'
import { auth } from '../../server/firebase';
import { useNavigate } from 'react-router-dom';

export default function SignOut({userName, setShowSignOut}) {

    const navigate = useNavigate();

    const handleLogout = () => {               
        signOut(auth).then(() => {
        // Sign-out successful.
            navigate("/");
            console.log("Signed out successfully")
        }).catch((error) => {
        // An error happened.
        });
    }

    return (
        <div className='w-screen h-screen absolute z-10 top-0 bg-transparent' onClick={() => setShowSignOut(false)}>
            <div className='bg-white absolute z-50 top-12 right-3 rounded p-2'>
                <div className='flex flex-col items-center'>
                    <span>{userName}</span>
                    <button className='rounded w-fit p-1 bg-red-500 text-white mt-2' onClick={handleLogout}>Sign out</button>
                </div>
            </div>
        </div>
        // <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border">
        //     <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
        //         <div class="sm:flex sm:items-start">
        //             <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
        //                 <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
        //                     <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        //                 </svg>
        //             </div>
        //             <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
        //                 <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Deactivate account</h3>
        //                 <div class="mt-2">
        //                     <p class="text-sm text-gray-500">Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone.</p>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        //     <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        //         <button type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto">Deactivate</button>
        //         <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
        //     </div>
        // </div>
    )
}
