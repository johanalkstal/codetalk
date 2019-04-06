import firebase from "firebase/app";
import * as firebaseui from "firebaseui";
import "firebaseui/dist/firebaseui.css";

let ui = null;

export function initUI({ onSignIn }) {
  if (!ui) {
    ui = new firebaseui.auth.AuthUI(firebase.auth());
  }

  ui.start("#firebaseui", {
    signInOptions: [
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        requireDisplayName: true,
      },
    ],
    signInSuccessUrl: "/",
    callbacks: {
      signInSuccessWithAuthResult: (authResult, redirectUrl) => {
        onSignIn(authResult);
      },
      signInFailure: error => {
        console.log("failure", error);
      },
    },
  });
}

export function signOut() {
  firebase
    .auth()
    .signOut()
    .then(function() {
      window.location.replace("/");
    })
    .catch(function(error) {
      console.log(error);
    });
}
