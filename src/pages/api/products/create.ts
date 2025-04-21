import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/libs/firebaseAdmin';
import { authenticate } from '@/libs/apiMiddleware';
import { allowCors } from '@/libs/cors';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({
            error: 'Method not allowed',
            code: 'method-not-allowed',
        });
    }

    // Authenticate user and ensure they are a vendor
    const result = await authenticate(req, res, 'vendor');
    if (!result) {
        return; // Response already sent by authenticate
    }

    const { userId } = result;
    const { name, price, description } = req.body;

    // Validate input data
    if (!name || typeof price !== 'number' || price <= 0 || typeof description !== 'string') {
        return res.status(400).json({
            error: 'Invalid product data: name, price (>0), and description are required',
            code: 'products/invalid-data',
        });
    }

    try {
        const productData = {
            name: name.trim(),
            price: parseFloat(price.toFixed(2)),
            description: description.trim(),
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
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({
            error: 'Failed to create product',
            code: 'internal-error',
        });
    }
}

export default allowCors(handler);