import { Request, Response } from 'express';
import { signToken } from '../utils/jwt.util';
import { auth, firestore } from '../config/firebase';

export const register = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ error: 'Email, password, and role are required' });
    }

    if (!['buyer', 'vendor', 'rider'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role specified' });
    }

    try {
        const userRecord = await auth.createUser({ email, password });

        const userData = {
            uid: userRecord.uid,
            email,
            role,
        };

        await firestore.collection('users').doc(userRecord.uid).set(userData);

        const token = signToken(userRecord.uid, role);

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Registration failed' });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_WEB_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, returnSecureToken: true }),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(401).json({ error: data.error?.message || 'Login failed' });
        }

        const userSnap = await firestore.collection('users').doc(data.localId).get();

        if (!userSnap.exists) {
            return res.status(404).json({ error: 'User record not found in DB' });
        }

        const user = userSnap.data();
        const token = signToken(user!.uid, user!.role);

        res.status(200).json({ message: 'Login successful', token });
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Login failed' });
    }
};