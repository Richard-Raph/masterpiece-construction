// server/src/middlewares/auth.ts
import { auth } from '../config/firebase';
import { User, getUserById } from '../models/User';
import { Request, Response, NextFunction } from 'express';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

// Verify Firebase JWT and attach user to request
export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization?.split('Bearer ')[1];

    if (!token) {
        res.status(401).json({ message: 'Unauthorized: No token provided' });
        return;
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        const user = await getUserById(decodedToken.uid);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('JWT verification error:', error);
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

// Role-based middleware (higher-order function)
export const requireRole = (role: 'buyer' | 'vendor' | 'rider') => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        if (req.user.role !== role) {
            res.status(403).json({
                message: `Forbidden: Requires ${role} role`
            });
            return;
        }

        next();
    };
};

// Shorthand middlewares for each role
export const isBuyer = requireRole('buyer');
export const isRider = requireRole('rider');
export const isVendor = requireRole('vendor');