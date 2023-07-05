import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBLlV6GHxLYbt77uBtqzssj13VdbwcXAz4",
  authDomain: "feedbackapp-a11ae.firebaseapp.com",
  projectId: "feedbackapp-a11ae",
  storageBucket: "feedbackapp-a11ae.appspot.com",
  messagingSenderId: "728062999951",
  appId: "1:728062999951:web:1dfc4389a9f32b69789ffa",
  measurementId: "G-9M5XH2C2HG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;



