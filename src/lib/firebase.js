// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZTJmAvQadHy_bpudq8fV9i9kpIrTmRiE",
  authDomain: "minesweeper-sp02.firebaseapp.com",
  projectId: "minesweeper-sp02",
  storageBucket: "minesweeper-sp02.appspot.com",
  messagingSenderId: "99835616339",
  appId: "1:99835616339:web:f7b3d04706f25609effaa6"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export default app