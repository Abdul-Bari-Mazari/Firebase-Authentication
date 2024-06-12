import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  verifyBeforeUpdateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
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

if (password__eyeIcon) {
  password__eyeIcon.addEventListener("click", showPassword);
}

const register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("userCredential", userCredential);
      alert("Succesfully Registered!");
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
let verify__status = document.querySelector(".verify__status");

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
      user__verification.innerText = "";
      verify__status.innerHTML = "Verified";
      // user__verification.style.backgroundColor = "lightgreen";
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
      alert("Successfully Signed in!");
      window.location = "./profile.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error", error);
    });
};

if (signInBtn) {
  signInBtn.addEventListener("click", signIn);
}

const sendEmail = () => {
  sendEmailVerification(auth.currentUser).then(() => {
    alert("Email successfully sent!");
  });
};

if (user__verification) {
  user__verification.addEventListener("click", sendEmail);
}

let resetPasswordBtn = document.querySelector(".reset_password_anchor");

const resetPassword = () => {
  sendPasswordResetEmail(auth, email.value)
    .then(() => {
      console.log("Reset password email sent successfully!");
    })
    .catch((error) => {
      if (!email.value) {
        alert("Write your email first!");
      } else {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Reset password email wasn't sent!", errorMessage);
      }
    });
};

if (resetPasswordBtn) {
  resetPasswordBtn.addEventListener("click", resetPassword);
}

let change__email = document.getElementById("change__email");
let newEmail = document.querySelector(".newEmail");

const changeEmail = () => {
  verifyBeforeUpdateEmail(auth.currentUser, newEmail.value)
    .then(() => {
      alert("Email successfully updated!");
      alert("Login again with your new email");
      window.location.href = "./login.html";
    })
    .catch((error) => {
      alert("An Error occured changing the email!");
      console.log("Error", error);
    });
};

const reauthenticateUser = () => {
  const user = auth.currentUser;
  const emailCurrentPassword = document.getElementById("emailCurrentPassword");
  const credential = EmailAuthProvider.credential(
    user.email,
    emailCurrentPassword.value
  );

  reauthenticateWithCredential(user, credential)
    .then(() => {
      alert("Successfully authenticated!");
      changeEmail();
    })
    .catch((error) => {
      alert("An error occured authenticating!");
      console.log("Error authenticating:", error);
    });
};

if (change__email) {
  change__email.addEventListener("click", reauthenticateUser);
}

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
