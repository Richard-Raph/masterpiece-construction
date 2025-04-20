import { auth } from '../config/firebase';
import { Request, Response } from 'express';
import { UserRole, createUser, getUserByEmail } from '../models/User';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, role } = req.body as {
            email: string;
            role: UserRole;
            password: string;
        };

        // Validate role
        if (!['buyer', 'vendor', 'rider'].includes(role)) {
            res.status(400).json({ message: 'Invalid role' });
            return;
        }

        // Check if user exists
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            res.status(400).json({ message: 'Email already in use' });
            return;
        }

        // Create Firebase auth user
        const firebaseUser = await auth.createUser({
            email,
            password,
        });

        // Create user in Firestore
        await createUser({
            role,
            email,
            password: '[HASHED]', // In production, hash before storing
            // createdAt: new Date(),
            // updatedAt: new Date(),
        });

        // Generate JWT
        const token = await auth.createCustomToken(firebaseUser.uid);

        res.status(201).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response) => {
    // Client should handle Firebase SDK login
    // This endpoint just verifies and returns user data
    res.status(200).json({ message: 'Use Firebase client SDK for login' });
};

export const logout = async (req: Request, res: Response) => {
    // Client-side token invalidation
    res.status(200).json({ message: 'Logout handled client-side' });
};