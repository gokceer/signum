import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdeoT6EWR74zKpPM-r6hChk5ltjwxqp18",
  authDomain: "signum-8409a.firebaseapp.com",
  projectId: "signum-8409a",
  storageBucket: "signum-8409a.appspot.com",
  messagingSenderId: "975737042744",
  appId: "1:975737042744:web:e18844042bce25b1b333cd",
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig) 
} else {
  app = firebase.app()
}

const db = app.firestore()
const auth = firebase.auth()

export { db, auth }