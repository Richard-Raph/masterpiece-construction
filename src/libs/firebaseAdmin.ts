import { getAuth } from 'firebase-admin/auth';
import serviceAccount from './serviceAccount.json';
import { getFirestore } from 'firebase-admin/firestore';
import { cert, getApps, initializeApp } from 'firebase-admin/app';

// Transform the JSON to match the ServiceAccount interface
const serviceAccountConfig: import('firebase-admin').ServiceAccount = {
    projectId: serviceAccount.project_id,
    privateKey: serviceAccount.private_key,
    clientEmail: serviceAccount.client_email,
};

const firebaseAdminConfig = {
    credential: cert(serviceAccountConfig),
};

const app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];
console.log('Firebase Admin initialized for project:', app.options.projectId);
const adminDb = getFirestore(app);
const adminAuth = getAuth(app);

export { adminAuth, adminDb };