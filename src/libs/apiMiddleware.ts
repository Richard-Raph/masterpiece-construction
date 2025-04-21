import { NextApiRequest, NextApiResponse } from 'next';
import { adminAuth, adminDb } from '@/libs/firebaseAdmin';

// apiMiddleware.ts
export const authenticate = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const authHeader = req.headers.authorization;
        console.log('Auth header:', authHeader); // Debug
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({
                error: 'Missing authorization header',
                code: 'auth/missing-header',
            });
        }

        const token = authHeader.split(' ')[1];
        console.log('Token:', token); // Debug

        const decodedToken = await adminAuth.verifyIdToken(token);
        console.log('Decoded token:', decodedToken); // Debug

        if (new Date() > new Date(decodedToken.exp * 1000)) {
            return res.status(401).json({
                error: 'Session expired. Please log in again.',
                code: 'auth/session-expired',
            });
        }

        const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
        console.log('User exists:', userDoc.exists); // Debug
        if (!userDoc.exists) {
            return res.status(404).json({
                error: 'User not found',
                code: 'auth/user-not-found',
            });
        }

        return {
            userId: decodedToken.uid,
            userData: userDoc.data(),
        };
    } catch (error) {
        console.error('Authentication error:', error);

        // Handle specific Firebase errors
        if (error instanceof Error && error.message.includes('Firebase ID token has expired')) {
            return res.status(401).json({
                error: 'Session expired. Please log in again.',
                code: 'auth/session-expired',
            });
        } else if (error instanceof Error && error.message.includes('invalid token')) {
            return res.status(401).json({
                error: 'Invalid authentication token',
                code: 'auth/invalid-token',
            });
        }

        // Generic error
        return res.status(500).json({
            error: 'Authentication failed. Please try again.',
            code: 'auth/failed',
        });
    }
};