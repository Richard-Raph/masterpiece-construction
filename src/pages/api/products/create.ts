import { db } from '@/libs/firebase';
import { verifyIdToken } from '@/libs/firebaseAdmin';
import { NextApiRequest, NextApiResponse } from 'next';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Verify user is authenticated
        const token = req.headers.authorization?.split('Bearer ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const decodedToken = await verifyIdToken(token);
        const uid = decodedToken.uid;

        // Check if user is a vendor
        const userDoc = await getDoc(doc(db, 'users', uid));
        if (!userDoc.exists() || userDoc.data().role !== 'vendor') {
            return res.status(403).json({ message: 'Only vendors can create products' });
        }

        // Create product
        const productData = req.body;
        const productRef = doc(db, 'products');
        await setDoc(productRef, {
            ...productData,
            vendorId: uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        return res.status(201).json({ id: productRef.id });
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}