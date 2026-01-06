// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCKremESQWjLAa3nXS4yZDW2DUOarvnNIM",
  authDomain: "marry-919db.firebaseapp.com",
  projectId: "marry-919db",
  storageBucket: "marry-919db.firebasestorage.app",
  messagingSenderId: "110206332522",
  appId: "1:110206332522:web:1a4c925c6e56cee85c6413",
  measurementId: "G-KM56D1CC41"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);