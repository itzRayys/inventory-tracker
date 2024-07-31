// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { api_key } from "./credentials";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "api_key",
  authDomain: "inventory-management-b75ad.firebaseapp.com",
  projectId: "inventory-management-b75ad",
  storageBucket: "inventory-management-b75ad.appspot.com",
  messagingSenderId: "863418005097",
  appId: "1:863418005097:web:efc56ffd1fb8b073e694f8",
  measurementId: "G-GDJTL9KM1F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
export { firestore }