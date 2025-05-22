import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmtRfxbMe0Y4JoezVqC8wvHrd9lkhgu8Q",
  authDomain: "electrify-63af2.firebaseapp.com",
  projectId: "electrify-63af2",
  storageBucket: "electrify-63af2.appspot.com",
  messagingSenderId: "586618627084",
  appId: "1:586618627084:web:6062faa240d76282fa3a29"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Export the modules we need
const auth = firebase.auth;
const db = firebase.firestore();

export { firebase, auth, db };