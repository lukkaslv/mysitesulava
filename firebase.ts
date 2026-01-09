
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA0ozJhySxsYwyfsdwHAa-oWu_TFnqxTG8",
  authDomain: "sulavapsycho.firebaseapp.com",
  projectId: "sulavapsycho",
  storageBucket: "sulavapsycho.firebasestorage.app",
  messagingSenderId: "958578915516",
  appId: "1:958578915516:web:410ea4a5f00645f5ddb8b9",
  measurementId: "G-20J09SY28S"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
