import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import serviceAccount from './serviceAccount.json'

// Transform the JSON to match the ServiceAccount interface
const serviceAccountConfig: import('firebase-admin').ServiceAccount = {
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
};

const firebaseAdminConfig = {
    credential: cert(serviceAccountConfig),
};

const app = getApps().length === 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];
console.log('Firebase Admin initialized for project:', app.options.projectId);
const adminAuth = getAuth(app);
const adminDb = getFirestore(app);

export { adminAuth, adminDb };