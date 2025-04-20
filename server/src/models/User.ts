// server/src/models/User.ts
import { db } from '../config/firebase';
import { DocumentReference } from 'firebase-admin/firestore';

// User roles (matches your requirements)
export type UserRole = 'buyer' | 'vendor' | 'rider';

// User interface
export interface User {
    id?: string; // Added when fetched from Firestore
    email: string;
    password?: string; // Only for signup (hashed later)
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
}

// Firestore collection name
const COLLECTION_NAME = 'users';

// Utility functions
export const getUserById = async (id: string): Promise<User | null> => {
    const doc = await db.collection(COLLECTION_NAME).doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } as User : null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
    const snapshot = await db.collection(COLLECTION_NAME).where('email', '==', email).get();
    return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as User;
};

export const createUser = async (user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<DocumentReference> => {
    const newUser: Omit<User, 'id'> = {
        ...user,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return db.collection(COLLECTION_NAME).add(newUser);
};