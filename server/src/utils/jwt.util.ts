import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET as string;

export const signToken = (uid: string, role: string) => {
    return jwt.sign({ uid, role }, jwtSecret, { expiresIn: '7d' });
};

export const verifyToken = (token: string): { uid: string; role: string } => {
    return jwt.verify(token, jwtSecret) as { uid: string; role: string };
};