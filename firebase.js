import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCj5PiipCXZ_xKHpjy38Go-JzyR18qDEcw",
  authDomain: "st-practice-975cb.firebaseapp.com",
  projectId: "st-practice-975cb",
  storageBucket: "st-practice-975cb.appspot.com",
  messagingSenderId: "708217413194",
  appId: "1:708217413194:web:52628d7b98e22a1e44d0b3",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
