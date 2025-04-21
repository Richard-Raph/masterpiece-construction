import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/libs/firebaseAdmin';
import { authenticate } from '@/libs/apiMiddleware';
import { allowCors } from '@/libs/cors';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({
            error: 'Method not allowed',
            code: 'method-not-allowed',
        });
    }

    const result = await authenticate(req, res, 'vendor');
    if (!result) {
        return;
    }

    const { userId } = result;

    try {
        const snapshot = await adminDb
            .collection('products')
            .where('vendorId', '==', userId)
            .get();

        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            price: doc.data().price,
            stock: doc.data().stock || 0,
            description: doc.data().description,
            status: doc.data().status || 'active',
        }));

        return res.status(200).json({ products });
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({
            error: 'Failed to fetch products',
            code: 'internal-error',
        });
    }
}

export default allowCors(handler);