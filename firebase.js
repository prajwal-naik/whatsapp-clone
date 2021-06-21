import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCTBUw1IiRJRS7IPAU9ALLx4KAv-DfyZKc",
    authDomain: "whatsapp-2-61b80.firebaseapp.com",
    projectId: "whatsapp-2-61b80",
    storageBucket: "whatsapp-2-61b80.appspot.com",
    messagingSenderId: "678440684703",
    appId: "1:678440684703:web:6089239e1530853b9826aa"
};

const app = !firebase.apps.length ? 
    firebase.initializeApp(firebaseConfig) 
    : 
    firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };
