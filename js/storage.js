import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-storage.js";

import { auth } from "./firebase.js";
import { API_KEY } from "./api-key.js";
import { doc } from "./firestore.js";
// import { doc } from "./firestore.js";

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: "project-01-21b2a.firebaseapp.com",
  projectId: "project-01-21b2a",
  storageBucket: "project-01-21b2a.appspot.com",
  messagingSenderId: "92113690473",
  appId: "1:92113690473:web:1d7665be80d8418183e7f8",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

let userId;
let user;

const progressBarContainer = document.querySelector(".progress");
const progressBar = document.querySelector(".progress-bar");

const uploadToStorage = (file) => {
  return new Promise((resolve, reject) => {
    user = auth.currentUser;
    userId = auth.currentUser.uid;
    if (!user) {
      reject(new Error("User not signed in"));
      return;
    }
    // const file = document.getElementById("file");
    console.log("---------------uploadToStorage--------------");
    const fileName = file.name;
    const fileExtension = fileName.slice(fileName.lastIndexOf("."));
    console.log("fileName:", fileName);
    console.log("fileExtension:", fileExtension);
    console.log(`users/${userId}UserProfile`);
    const storageRef = ref(storage, `users/${userId}/UserProfile`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressBarContainer.style.display = "flex";
        progressBar.style.width = `${progress}%`;
        if (progress === 100) {
          progressBarContainer.style.display = "none";
        }
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log("Upload Failed:", error);
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
          user__image.src = downloadURL;
        });
      }
    );
  });
};

const uploadBtn = document.getElementById("uploadBtn");

const uploadFile = async () => {
  const file = document.getElementById("file");
  const fileName = file.files[0].name;
  const fileExtension = fileName.slice(fileName.lastIndexOf("."));
  console.log("---------------UploadFile Function---------------");
  console.log("file:", file.files[0]);
  console.log("fileName:", fileName);
  console.log("fileExtension:", fileExtension);

  const url = await uploadToStorage(file.files[0]);

  console.log("url--------------->", url);
  displayImage();
};

if (uploadBtn) {
  uploadBtn.addEventListener("click", uploadFile);
}

const user__image__container = document.getElementById(
  "user__image__container"
);
const user__image = document.querySelector(".user__image");
const spinner = document.getElementById("spinner");
const imageEditIcon = document.getElementById("imageEditIcon");

const getImageFromStorage = () => {
  return new Promise((resolve, reject) => {
    userId = auth.currentUser.uid;
    getDownloadURL(ref(storage, `users/${userId}/UserProfile`))
      .then((url) => {
        resolve(url);
      })
      .catch((error) => {
        let errorCode = error.code;
        console.log("Get Image:", errorCode);
        spinner.style.display = "none";
        user__image__container.style.display = "block";

        reject(error);
      });
  });
};

const displayImage = () => {
  spinner.style.display = "block";
  user__image__container.style.display = "none";
  getImageFromStorage()
    .then((url) => {
      user__image.onload = () => {
        // Image has loaded, hide spinner and show image
        spinner.style.display = "none";
        user__image__container.style.display = "block";
      };
      user__image.src = url;
    })
    .catch((error) => {
      let errorCode = error.code;
      console.log("Error displaying image:", errorCode);
      spinner.style.display = "none";
    });
};

export { displayImage };
