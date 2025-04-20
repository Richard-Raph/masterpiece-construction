import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET as string;

export const signToken = (uid: string, role: string) => {
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not configured');
    }
    return jwt.sign({ uid, role }, jwtSecret, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not configured');
    }
    return jwt.verify(token, jwtSecret) as { uid: string; role: string };
};