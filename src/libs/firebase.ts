import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';
import { getApps, FirebaseApp, initializeApp } from 'firebase/app';

const firebaseConfig = {
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

if (typeof window !== 'undefined' && !getApps().length) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
}

export { db, auth };
