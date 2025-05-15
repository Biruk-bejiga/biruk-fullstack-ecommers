import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDptzqOR_XTd04loqVGbbvYFxjSTz06VG0",
  authDomain: "biruk-ecommers.firebaseapp.com",
  projectId: "biruk-ecommers",
  storageBucket: "biruk-ecommers.firebasestorage.app",
  messagingSenderId: "868924689033",
  appId: "1:868924689033:web:af503122869a1894535458",
  measurementId: "G-K2XPDJ1NRH"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, auth, firestore, storage };
