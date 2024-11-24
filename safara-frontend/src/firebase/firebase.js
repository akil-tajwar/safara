// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDf_Lwj-ZcL_-c6uws5UI_vGM81Rva_rL0',
  authDomain: 'safara-85edf.firebaseapp.com',
  projectId: 'safara-85edf',
  storageBucket: 'safara-85edf.appspot.com',
  messagingSenderId: '839104368645',
  appId: '1:839104368645:web:4da3c3ffe25d4787ddcc6c',
};
console.log("🚀 ~ firebaseConfig:", firebaseConfig)
console.log("🚀 ~ firebaseConfig.storageBucket:", firebaseConfig.storageBucket)

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export default app