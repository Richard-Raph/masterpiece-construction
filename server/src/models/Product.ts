// server/src/models/Product.ts
import { db } from '../config/firebase';
import { DocumentReference } from 'firebase-admin/firestore';

// Product interface
export interface Product {
    id?: string;
    name: string;
    price: number;
    vendorId: string; // Reference to Vendor's user ID
    createdAt: Date;
    updatedAt: Date;
}

const COLLECTION_NAME = 'products';

export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<DocumentReference> => {
    const newProduct: Omit<Product, 'id'> = {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
    return db.collection(COLLECTION_NAME).add(newProduct);
};

export const getProductsByVendor = async (vendorId: string): Promise<Product[]> => {
    const snapshot = await db.collection(COLLECTION_NAME).where('vendorId', '==', vendorId).get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
};