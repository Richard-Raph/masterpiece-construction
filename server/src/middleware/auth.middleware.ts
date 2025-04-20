import { firestore } from '../config/firebase';
import { verifyToken } from '../utils/jwt.util';
import { Response, NextFunction } from 'express';

export const authenticate = async (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        const userSnap = await firestore.collection('users').doc(decoded.uid).get();

        if (!userSnap.exists) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = userSnap.data();
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};