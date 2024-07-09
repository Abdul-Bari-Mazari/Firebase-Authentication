import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  deleteUser,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

import { API_KEY } from "./api-key.js";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "project-01-21b2a.firebaseapp.com",
  projectId: "project-01-21b2a",
  storageBucket: "project-01-21b2a.appspot.com",
  messagingSenderId: "92113690473",
  appId: "1:92113690473:web:1d7665be80d8418183e7f8",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {
  auth,
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  deleteUser,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  // Sign in with google
  googleProvider,
  GoogleAuthProvider,
  signInWithPopup,
};
