import firebase from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyAXujsZDcE-I_h4S6u8bu7cyqrWiqaaSLQ",
    authDomain: "virtual-meet-88e3e.firebaseapp.com",
    databaseURL: "https://virtual-meet-88e3e-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "virtual-meet-88e3e",
    storageBucket: "virtual-meet-88e3e.appspot.com",
    messagingSenderId: "840596868158",
    appId: "1:840596868158:web:114082299adc9a2e8dd56f"
}

firebase.initializeApp(firebaseConfig);

const dbRef = firebase.database().ref();