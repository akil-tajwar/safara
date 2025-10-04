// firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_SAFARA_apiKey,
  authDomain: import.meta.env.VITE_SAFARA_authDomain,
  projectId: import.meta.env.VITE_SAFARA_projectId,
  storageBucket: import.meta.env.VITE_SAFARA_storageBucket,
  messagingSenderId: import.meta.env.VITE_SAFARA_messagingSenderId,
  appId: import.meta.env.VITE_SAFARA_appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
