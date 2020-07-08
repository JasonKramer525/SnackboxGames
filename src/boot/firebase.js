// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

var firebaseConfig = {
    apiKey: "AIzaSyDt0ypXqTPpsTVebMwKFylQ4mmlLJ8sxtY",
    authDomain: "friendlychat-549f5.firebaseapp.com",
    databaseURL: "https://friendlychat-549f5.firebaseio.com",
    projectId: "friendlychat-549f5",
    storageBucket: "friendlychat-549f5.appspot.com",
    messagingSenderId: "1006010896589",
    appId: "1:1006010896589:web:eb14067b22c6c19faad984"
  };
  // Initialize Firebase
  let firebaseApp = firebase.initializeApp(firebaseConfig);
  let firebaseAuth = firebaseApp.auth();
  let firebaseDb = firebaseApp.database();

export { firebaseAuth, firebaseDb }