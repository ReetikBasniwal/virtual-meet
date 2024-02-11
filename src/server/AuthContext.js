
import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { child, get, ref } from "firebase/database";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const dbRef = ref(db);
    console.log(dbRef, "dbRef")
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
              // User is signed in, see docs for a list of available properties
              // https://firebase.google.com/docs/reference/js/auth.user
              const uid = user.uid;
              get(child(dbRef, `users/${uid}`)).then((snapshot) => {
                if (snapshot.exists()) {
                  console.log(snapshot.val());
                  setCurrentUser({...user, ...snapshot.val()});
                } else {
                  console.log("No data available");
                }
                setLoading(false);
              }).catch((error) => {
                console.error(error);
              });
              setLoading(false);
              setCurrentUser(null);
              // ...
            } else {
              // User is signed out
              // ...
              setLoading(false);
              setCurrentUser(null);
            }
        });
    },[])

    if (loading) {
        return <p>Loading...</p>;
    }
    return (
        <AuthContext.Provider value={{ currentUser }}>
          {children}
        </AuthContext.Provider>
    );
}