import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { cert, getApps, initializeApp } from 'firebase-admin/app';

if (!process.env.FIREBASE_ADMIN_PROJECT_ID) {
    throw new Error('Missing Firebase admin configuration');
}

const firebaseAdminConfig = {
    credential: cert({
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
};

const app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];
console.log('Firebase Admin initialized for project:', app.options.projectId);
const adminDb = getFirestore(app);
const adminAuth = getAuth(app);

export { adminDb, adminAuth };