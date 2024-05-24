// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANdAgxXwRsE1H7xD-QTiYJWiWFsmUndyk",
  authDomain: "realestate-project-d2fb8.firebaseapp.com",
  projectId: "realestate-project-d2fb8",
  storageBucket: "realestate-project-d2fb8.appspot.com",
  messagingSenderId: "1088768967114",
  appId: "1:1088768967114:web:fa1ae07d3645bf28764f33",
  measurementId: "G-BN7WQB8ENQ"
};

// Initialize Firebase
let firebase_app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebase_app;