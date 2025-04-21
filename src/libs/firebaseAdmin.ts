import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { cert, getApps, initializeApp } from 'firebase-admin/app';

// Initialize Firebase Admin with credentials from environment variables
const serviceAccountConfig = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

const firebaseAdminConfig = {
    credential: cert(serviceAccountConfig),
};

// Initialize Firebase app if not already initialized
const app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];
console.log('Firebase Admin initialized for project:', app.options.projectId);

const adminDb = getFirestore(app);
const adminAuth = getAuth(app);

export { adminAuth, adminDb };