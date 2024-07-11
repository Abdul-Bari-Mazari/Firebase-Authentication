import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  collection,
  getDoc,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-firestore.js";

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
const db = getFirestore(app);

// **********************^ Firestore *****************************

import { user, user__name, displayName } from "./app.js";
import { displayImage } from "./storage.js";

// Add user to firestore
const spinnerMain = document.getElementById("spinnerMain");
const user__profile = document.querySelector(".user__profile");

const addUserToFirestore = async (user) => {
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    spinnerMain.style.display = "none";
    user__profile.style.display = "flex";
    await setDoc(userRef, {
      name: user.displayName || "Anonymous",
      email: user.email,
      email_status: user.emailVerified,
      phone: user.phoneNumber,
      photo: user.photoURL || "default_photo_url",
    })
      .then(() => {
        console.log("User added to Firestore");
      })
      .catch((error) => {
        console.error("Error adding user to Firestore:", error);
      });
  } else {
    console.log("User already exists in Firestore");
    displayImage();
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      if (doc.id === auth.currentUser.uid) {
        console.log(`${doc.id} => ${doc.data().name}`);
        user__name.value = doc.data().name;
        if (user__name.value === doc.data().name) {
          spinnerMain.style.display = "none";
          user__profile.style.display = "flex";
        }
      }
    });
  }
};

// window.addUserToFirestore = addUserToFirestore;

// Read data from firestore
const readData = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    if (doc.id === auth.currentUser.uid) {
      console.log(`${doc.id} => ${doc.data().name}`);
    }
  });
};

const updateName = async () => {
  const userRef = doc(db, "users", auth.currentUser.uid);
  await updateDoc(userRef, {
    name: user__name.value,
  });
};

// Update data in firestore

const updateDataInFirestore = async () => {
  console.log(user__name.value);
  console.log("uid", auth.currentUser.uid);
  if (user__name.value === "" || user__name.value === " ") {
    alert("Name can't be empty!");
  } else {
    await updateName(user__name.value);
    alert("Name successfully updated!");
    await readData();
  }
};
console.log("auth.currentUser =>", auth.currentUser);
console.log("auth =>", auth);

const authState = onAuthStateChanged(auth, async (user) => {
  console.log("firestore user", user);
  await readData();
});

window.onload = authState;

let saveNameBtn = document.querySelector(".saveNameBtn");

saveNameBtn && saveNameBtn.addEventListener("click", updateDataInFirestore);

// Exports

export {
  doc,
  setDoc,
  db,
  updateDoc,
  collection,
  getDoc,
  getDocs,
  addUserToFirestore,
};
