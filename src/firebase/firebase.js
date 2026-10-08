import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBbGdAjmO2kDx1TUPZSgOg4HFGJ-vY1YVw",
  authDomain: "queueless-defaa.firebaseapp.com",
  projectId: "queueless-defaa",
  storageBucket: "queueless-defaa.firebasestorage.app",
  messagingSenderId: "358419033421",
  appId: "1:358419033421:web:70067b773a1fcda4781b04",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
