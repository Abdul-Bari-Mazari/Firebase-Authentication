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
  updatePassword,
  deleteUser,
  RecaptchaVerifier,
  signInWithPhoneNumber,
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
      window.location.href = "./login.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === "auth/invalid-email") {
        alert("Invalid Email Address!");
      } else if (errorCode === "auth/missing-password") {
        alert("Password can't be empty!");
      }
      console.log("errorCode:", errorCode);
    });
};

if (registerBtn) {
  registerBtn.addEventListener("click", register); // Event
}

let user__email = document.querySelector(".user__email");
let user__phoneNumber = document.querySelector(".user__phoneNumber");
let user__controls = document.querySelector(".user__controls");
let status = document.querySelector(".status");
let user__verification = document.querySelector(".user__verification");
let verification_image = document.querySelector(".verification_image");
let verify__status = document.querySelector(".verify__status");

onAuthStateChanged(auth, (user) => {
  if (user) {
    if (user.phoneNumber !== null) {
      let profileContainer = document.querySelector(".profileContainer");
      console.log("User Phone:", user.phoneNumber);
      console.log("USER", user);
      profileContainer.style.width = "500px"
      status.style.display = "none";
      user__controls.style.display = "none";
      user__phoneNumber.innerText = user.phoneNumber;
    } else if (user.email !== null) {
      user__email.innerText = user.email;
      status.style.display = "block";
      user__controls.style.display = "flex";
    }

    if (user.emailVerified === true) {
      status.innerHTML = `&#9989;`;
      user__verification.innerText = "";
      verify__status.innerHTML = "Verified";
      console.log("Verify status:", verify__status.textContent);
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
      console.log("Verify status:", verify__status);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === "auth/invalid-email") {
        alert("Invalid Email Address!");
      } else if (errorCode === "auth/missing-password") {
        alert("Missing password!");
      } else if (errorCode === "auth/invalid-credential") {
        alert("Invalid credentials!");
      }
      console.log("errorCode:", errorCode);
      // console.log("error:", error.message);
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

let authenticationType = null;

const emailAuthentication = () => {
  authenticationType = "email";
  const currentPassElement = document.getElementById("emailCurrentPassword");
  reauthenticateUser(currentPassElement);
};

const passwordAuthentication = () => {
  authenticationType = "password";
  const currentPassElement = document.getElementById("passCurrentPassword");
  reauthenticateUser(currentPassElement);
};

const deleteAccAuthentication = () => {
  authenticationType = "delteAccount";
  const currentPassElement = document.getElementById(
    "deleteAccountCurrentPass"
  );
  reauthenticateUser(currentPassElement);
};

let change__email = document.getElementById("change__email");
let newEmail = document.querySelector(".newEmail");

const updateEmail = () => {
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

let change__password = document.getElementById("change__password");

const updatePasswordFunc = () => {
  const user = auth.currentUser;
  const new_password = document.getElementById("newPassword");
  const newPassword = new_password.value;

  updatePassword(user, newPassword)
    .then(() => {
      alert("Password updated successfully");
    })
    .catch((error) => {
      alert("Error updating password");
      console.log("Error updating password:", error);
    });
};

if (change__password) {
  change__password.addEventListener("click", passwordAuthentication);
}

let deleteAccBtn = document.getElementById("deleteAccBtn");

const deleteAccount = () => {
  const user = auth.currentUser;

  deleteUser(user)
    .then(() => {
      alert("Your account has been deleted!");
      console.log("Account deleted!", user);
      window.location.href = "./index.html";
    })
    .catch((error) => {
      alert("An error occured deleting account!");
      console.log("Error:", error);
    });
};

if (deleteAccBtn) {
  deleteAccBtn.addEventListener("click", deleteAccAuthentication);
}

const reauthenticateUser = (currentPassElement) => {
  const user = auth.currentUser;
  const credential = EmailAuthProvider.credential(
    user.email,
    currentPassElement.value
  );

  reauthenticateWithCredential(user, credential)
    .then(() => {
      alert("Successfully authenticated!");
      if (authenticationType === "email") {
        updateEmail();
      } else if (authenticationType === "password") {
        updatePasswordFunc();
      } else if (authenticationType === "delteAccount") {
        deleteAccount();
      }
    })
    .catch((error) => {
      alert("An error occured authenticating!");
      console.log("Error authenticating:", error);
    });
};

if (change__email) {
  change__email.addEventListener("click", emailAuthentication);
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

// ! Phone authentication

let sendCodeBtn = document.getElementById("sendCodeBtn");
let confirmationResultGlobal;

const registerWithPhone = () => {
  const phoneNumber = document.getElementById("phoneNumber");
  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {}
  );

  const appVerifier = window.recaptchaVerifier;

  signInWithPhoneNumber(auth, `+${phoneNumber.value}`, appVerifier)
    .then((confirmationResult) => {
      alert("Verification code sent!");
      confirmationResultGlobal = confirmationResult;
    })
    .catch((error) => {
      console.log("Error:", error);
    });
};

let verifyOTPBtn = document.getElementById("verifyOTPBtn");

const verifyOTP = () => {
  const code = document.getElementById("OTPInput");
  confirmationResultGlobal
    .confirm(code.value)
    .then((result) => {
      const user = result.user;
      console.log("user:", user);
      alert("OTP verified!");
      window.location.href = "./profile.html";
    })
    .catch((error) => {
      console.log("Error:", error);
    });
};

if (sendCodeBtn) {
  sendCodeBtn.addEventListener("click", registerWithPhone);
}

if (verifyOTPBtn) {
  verifyOTPBtn.addEventListener("click", verifyOTP);
}
