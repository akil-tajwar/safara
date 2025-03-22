// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_SAFARA_apiKey ,
  authDomain:import.meta.env.VITE_SAFARA_authDomain,
  projectId: import.meta.env.VITE_SAFARA_projectId,
  storageBucket:import.meta.env.VITE_SAFARA_storageBucket ,
  messagingSenderId: import.meta.env.VITE_SAFARA_messagingSenderId,
  appId: import.meta.env.VITE_SAFARA_appId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export default app