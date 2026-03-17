import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDnB03bwWqadmuU-zGzQ1KKdwbeDtFNygI",
  authDomain: "olymp-shop.firebaseapp.com",
  databaseURL: "https://olymp-shop-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "olymp-shop",
  storageBucket: "olymp-shop.firebasestorage.app",
  messagingSenderId: "895310779944",
  appId: "1:895310779944:web:ec4288dcd7e7fccf1a871d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
