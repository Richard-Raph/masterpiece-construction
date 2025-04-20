import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { cert, getApps, initializeApp } from 'firebase-admin/app';

const firebaseAdminConfig = {
    credential: cert({
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
};

const app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];
const adminAuth = getAuth(app);
const adminDb = getFirestore(app);

export { adminAuth, adminDb };

export const verifyIdToken = async (token: string) => {
    try {
        return await adminAuth.verifyIdToken(token);
    } catch (error) {
        console.error('Error verifying token:', error);
        throw new Error('Invalid or expired token');
    }
};