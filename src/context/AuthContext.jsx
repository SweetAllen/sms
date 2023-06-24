import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {collection, addDoc, Timestamp, setDoc,doc,getDocs} from 'firebase/firestore'
import { auth, db } from "../firebase";
const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {

  //        await addDoc(collection(db, "rating"), {
//- phone_no
// - message
// - sent  (0/1)
// - source (excel/digital)
  function addToDb(phone_no, message, sent, source) {
    return  addDoc(collection(db, "smsdata"), {
      phone_no: phone_no,
      sent: sent,
      source:source
    
    });
  }
  function readData() {
    return  getDocs(doc(db, "smsdata"))
  }






  return (
    <userAuthContext.Provider value={{ addToDb, readData }}>
      {children}
    </userAuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(userAuthContext);
}