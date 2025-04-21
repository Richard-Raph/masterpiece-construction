import { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/libs/firebaseAdmin';

export const authenticate = async (req: NextApiRequest, res: NextApiResponse, requiredRole: string = 'vendor') => {
    try {
        const userId = (req.query.userId || req.body.userId)?.toString();
        if (!userId || typeof userId !== 'string' || !/^[a-zA-Z0-9]{20,28}$/.test(userId)) {
            res.status(401).json({
                error: 'Invalid or missing user ID',
                code: 'auth/invalid-user-id',
            });
            return null;
        }

        const userDoc = await adminDb.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            res.status(404).json({
                error: 'User not found',
                code: 'auth/user-not-found',
            });
            return null;
        }

        const userData = userDoc.data();
        if (!userData) {
            res.status(404).json({
                error: 'User data not found',
                code: 'auth/no-user-data',
            });
            return null;
        }

        if (userData.role !== requiredRole) {
            res.status(403).json({
                error: `Only ${requiredRole}s can access this resource`,
                code: `auth/not-${requiredRole}`,
            });
            return null;
        }

        return {
            userId,
            userData,
        };
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            error: 'Authentication failed. Please try again.',
            code: 'auth/failed',
        });
        return null;
    }
};