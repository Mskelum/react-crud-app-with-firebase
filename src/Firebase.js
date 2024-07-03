import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC8v2FakjweCLNJ-Xo08ThkfIjwzkzMdzM",
  authDomain: "firstreactjs-39e4d.firebaseapp.com",
  projectId: "firstreactjs-39e4d",
  storageBucket: "firstreactjs-39e4d.appspot.com",
  messagingSenderId: "631041293740",
  appId: "1:631041293740:web:68f358725e61f2a6384e09",
  measurementId: "G-7CZ38PLJEK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
