// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDyteoYewanQJAUIQ2Wuiwa-UN0ZA9I6EI",
  authDomain: "trendik-40e90.firebaseapp.com",
  projectId: "trendik-40e90",
  storageBucket: "trendik-40e90.appspot.com",
  messagingSenderId: "511515376335",
  appId: "1:511515376335:web:cdc480033adf55fd9595ba",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
