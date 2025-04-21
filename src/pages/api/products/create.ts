import { adminDb } from '@/libs/firebaseAdmin';
import { authenticate } from '@/libs/apiMiddleware';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({
            error: 'Method not allowed',
            code: 'method-not-allowed',
        });
    }

    const result = await authenticate(req, res);
    if (!result) {
        return;
    }

    const { userId, userData } = result;

    if (userData?.role !== 'vendor') {
        return res.status(403).json({
            error: 'Only vendors can create products',
            code: 'auth/not-vendor',
        });
    }

    const { name, price, description } = req.body;

    if (!name || typeof price !== 'number' || price <= 0) {
        return res.status(400).json({
            error: 'Invalid product data',
            code: 'products/invalid-data',
        });
    }

    const productData = {
        name: name.trim(),
        price: parseFloat(price.toFixed(2)),
        description: description?.trim() || '',
        vendorId: userId,
        stock: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
    };

    const productRef = await adminDb.collection('products').add(productData);

    return res.status(201).json({
        id: productRef.id,
        ...productData,
    });
}