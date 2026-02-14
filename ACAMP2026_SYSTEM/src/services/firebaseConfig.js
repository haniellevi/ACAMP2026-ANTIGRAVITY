import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDQXzO10EZsD_XIR3Jxn61MwroAym8ZkZ0",
    authDomain: "acampfiladelfia.firebaseapp.com",
    projectId: "acampfiladelfia",
    storageBucket: "acampfiladelfia.firebasestorage.app",
    messagingSenderId: "462365534474",
    appId: "1:462365534474:web:258ea893b55077839b32f3",
    measurementId: "G-6CZCJ3RFNM"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Voltamos ao padrão simples para evitar bloqueios de cache offline em ambiente de desenvolvimento
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

