import { adminDb } from '@/libs/firebaseAdmin';
import { verifyIdToken } from '@/libs/firebaseAdmin';
import { NextApiRequest, NextApiResponse } from 'next';

interface ProductData {
    name: string;
    price: number;
    description?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ 
            success: false,
            error: 'Method not allowed' 
        });
    }

    try {
        // 1. Authentication Check
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'Missing or invalid authorization header'
            });
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = await verifyIdToken(token);
        const uid = decodedToken.uid;

        // 2. Authorization Check (Vendor Role)
        const userDoc = await adminDb.collection('users').doc(uid).get();
        const userData = userDoc.data();
        
        if (!userDoc.exists || userData?.role !== 'vendor') {
            return res.status(403).json({
                success: false,
                error: 'Only vendors can create products'
            });
        }

        // 3. Request Validation
        const productData: ProductData = req.body;
        
        if (!productData.name || !productData.price) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields (name and price are required)'
            });
        }

        if (typeof productData.price !== 'number') {
            return res.status(400).json({
                success: false,
                error: 'Price must be a number'
            });
        }

        // 4. Create Product
        const productRef = await adminDb.collection('products').add({
            name: productData.name.trim(),
            price: parseFloat(productData.price.toFixed(2)), // Ensure 2 decimal places
            description: productData.description?.trim() || '',
            vendorId: uid,
            vendorEmail: userData.email, // Store vendor email for reference
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'active' // Default status
        });

        // 5. Success Response
        return res.status(201).json({
            success: true,
            id: productRef.id,
            message: 'Product created successfully'
        });

    } catch (error) {
        console.error('Error creating product:', error);
        
        // Handle specific Firebase errors
        if (error instanceof Error && 'code' in error) {
            switch (error.code) {
                case 'auth/id-token-expired':
                    return res.status(401).json({
                        success: false,
                        error: 'Session expired. Please login again.'
                    });
                case 'auth/argument-error':
                    return res.status(401).json({
                        success: false,
                        error: 'Invalid authentication token'
                    });
            }
        }

        // Generic error response
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            details: error instanceof Error ? error.message : 'Unknown error occurred'
        });
    }
}
