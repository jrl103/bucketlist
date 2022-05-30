// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBEg6TSdrkUa8R4F5x5Ej5Zpsex-19gjr0",
  authDomain: "sparta-react-basic-586ce.firebaseapp.com",
  projectId: "sparta-react-basic-586ce",
  storageBucket: "sparta-react-basic-586ce.appspot.com",
  messagingSenderId: "705224693259",
  appId: "1:705224693259:web:becfa28516ba57bebd190e",
  measurementId: "G-R36PL64EZC"
};

initializeApp(firebaseConfig);
// Initialize Firebase
// const app = initializeApp(firebaseConfig);

export const db = getFirestore();