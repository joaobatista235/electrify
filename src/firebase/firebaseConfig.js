import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBmtRfxbMe0Y4JoezVqC8wvHrd9lkhgu8Q",
  authDomain: "electrify-63af2.firebaseapp.com",
  projectId: "electrify-63af2",
  storageBucket: "electrify-63af2.firebasestorage.app",
  messagingSenderId: "586618627084",
  appId: "1:586618627084:web:6062faa240d76282fa3a29"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };