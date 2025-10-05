// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// ✅ Always load from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_SAFARA_apiKey,
  authDomain: import.meta.env.VITE_SAFARA_authDomain,
  projectId: import.meta.env.VITE_SAFARA_projectId,
  storageBucket: import.meta.env.VITE_SAFARA_storageBucket,
  messagingSenderId: import.meta.env.VITE_SAFARA_messagingSenderId,
  appId: import.meta.env.VITE_SAFARA_appId,
};

// ✅ Initialize Firebase only once
const app = initializeApp(firebaseConfig);

// ✅ Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
export default app;
