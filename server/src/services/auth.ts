import * as admin from 'firebase-admin';
import { db } from '../config/firebase';

export const createUserWithRole = async (email: string, password: string, role: string) => {
    if (!['buyer', 'vendor', 'rider'].includes(role)) {
        throw new Error('Invalid role');
    }

    const userRecord = await admin.auth().createUser({
        email,
        password,
    });

    await admin.auth().setCustomUserClaims(userRecord.uid, { role });

    await db.collection('users').doc(userRecord.uid).set({
        role,
        email,
    });

    return userRecord;
};