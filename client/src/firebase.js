// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "nilexia-estate-38241.firebaseapp.com",
  projectId: "nilexia-estate-38241",
  storageBucket: "nilexia-estate-38241.appspot.com",
  messagingSenderId: "177955304698",
  appId: "1:177955304698:web:5d35a137ce44f88448c543"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);