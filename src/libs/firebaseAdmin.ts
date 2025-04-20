import { getAuth } from 'firebase-admin/auth';
import { cert, initializeApp } from 'firebase-admin/app';

const firebaseAdminConfig = {
    credential: cert({
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
};

const app = initializeApp(firebaseAdminConfig);
const adminAuth = getAuth(app);

export const verifyIdToken = (token: string) => {
    return adminAuth.verifyIdToken(token);
};