import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
} from "./firebase.js";

let email = document.getElementById("email"),
  password = document.getElementById("password");

let registerBtn = document.getElementById("register");
let signInBtn = document.getElementById("signIn");
let signOutBtn = document.getElementById("signOut");

let password__inputField = document.querySelector(".password__inputField");
let login__password__inputField = document.querySelector(
  ".login__password__inputField"
);
let password__eyeIcon = document.querySelector(".password__eyeIcon");

const showPassword = () => {
  if (
    (password__inputField && password__inputField.type === "text") ||
    login__password__inputField === "text"
  ) {
    password__inputField.type = "password";
  } else if (password__inputField) {
    password__inputField.type = "text";
  }

  if (
    login__password__inputField &&
    login__password__inputField.type === "text"
  ) {
    login__password__inputField.type = "password";
  } else if (login__password__inputField) {
    login__password__inputField.type = "text";
  }
};

password__eyeIcon.addEventListener("click", showPassword);

const register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("userCredential", userCredential);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error", error.message);
    });
};

if (registerBtn) {
  registerBtn.addEventListener("click", register); // Event
}

let user__email = document.querySelector(".user__email");
let status = document.querySelector(".status");
let user__verification = document.querySelector(".user__verification");
let verification_image = document.querySelector(".verification_image");

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("USER", user);
    console.log("User is signed in:", user.email);
    const uid = user.uid;
    console.log("user id:", uid);
    if (user__email) {
      user__email.innerText = user.email;
    }

    //

    if (user.emailVerified === true) {
      status.innerHTML = `&#9989;`;
      user__verification.innerText = "Verified";
      user__verification.style.backgroundColor = "lightgreen";
      verification_image.style.display = "none";
    }
  } else {
    console.log("User isn't signed in");
  }
});

const signIn = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("user", user);
      email.value, (password.value = "");
      window.location = "./profile.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error", errorMessage);
    });
};

if (signInBtn) {
  signInBtn.addEventListener("click", signIn); // Event
}

const sendEmail = () => {
  sendEmailVerification(auth.currentUser).then(() => {
    console.log("Email successfully sent!");
  });
};

if (user__verification) {
  user__verification.addEventListener("click", sendEmail);
}

// let user__email = document.querySelector("user__email");

// user__email.innerText = user.email;

const signOutUser = () =>
  signOut(auth)
    .then(() => {
      console.log("User has signed out");
      window.location = "./index.html";
    })
    .catch((error) => {
      console.log("An error occured signing out!", error);
    });

if (signOutBtn) {
  signOutBtn.addEventListener("click", signOutUser); // Event
}
