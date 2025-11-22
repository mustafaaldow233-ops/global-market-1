// firebase.js (ضعه في جذر المشروع)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// ----- ضع هنا إعدادات مشروعك من Firebase (لا تغيّر القيم لأنها خاصة بمشروعك) -----
const firebaseConfig = {
  apiKey: "AIzaSyDTxDtXoylZzLgUIyUkcj92ZN44voX0FA8",
  authDomain: "global-market-95a36.firebaseapp.com",
  projectId: "global-market-95a36",
  storageBucket: "global-market-95a36.firebasestorage.app",
  messagingSenderId: "967013217852",
  appId: "1:967013217852:web:b67ed2fddb5f0b7c05b539",
  measurementId: "G-B7WRYDLK6K"
};

// Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export for use in other scripts
export { app, auth, db, storage };
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export const db = getFirestore(app);
export { app, auth, db, storage };
