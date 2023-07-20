import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyC4PxBoDYpqtkmY-uJUlucw1i5b0_NviNY",
  authDomain: "rex-sms.firebaseapp.com",
  projectId: "rex-sms",
  storageBucket: "rex-sms.appspot.com",
  messagingSenderId: "1006560083013",
  appId: "1:1006560083013:web:fb58fc45bc5e2cbf37f72c"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

