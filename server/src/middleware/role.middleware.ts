import { Response, NextFunction } from 'express';

export const requireRole = (role: string) => {
    return (req: any, res: Response, next: NextFunction) => {
        if (!req.user || req.user.role !== role) {
            return res.status(403).json({ error: `Access restricted to ${role}s only` });
        }
        next();
    };
};