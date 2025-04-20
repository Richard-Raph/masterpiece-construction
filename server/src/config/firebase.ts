// server/src/config/firebase.ts
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Handle newline escapes
        }),
    });
}

// Firestore database instance
const db = admin.firestore();

// Auth instance (for JWT later)
const auth = admin.auth();

export { db, auth };