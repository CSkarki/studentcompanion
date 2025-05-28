// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyD2oqST8i5tqURqTs8D3i3c3SV7abLBKNU",
  authDomain: "kb-intelliprivateai.firebaseapp.com",
  projectId: "kb-intelliprivateai",
  storageBucket: "kb-intelliprivateai.firebasestorage.app",
  messagingSenderId: "853676165755",
  appId: "1:853676165755:web:1efd8563f49985ebec30de"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };

export default firebaseConfig;