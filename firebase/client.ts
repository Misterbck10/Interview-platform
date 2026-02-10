import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyAo9l9Am55yI4s9JbnjOVs7rQUaGbIolQ4",
    authDomain: "prepwise-f33d4.firebaseapp.com",
    projectId: "prepwise-f33d4",
    storageBucket: "prepwise-f33d4.firebasestorage.app",
    messagingSenderId: "948191642224",
    appId: "1:948191642224:web:16817f4f5b548a0ea16ab5",
    measurementId: "G-TY0JY8KRVL"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();


export const auth = getAuth(app);
export const db = getFirestore(app);