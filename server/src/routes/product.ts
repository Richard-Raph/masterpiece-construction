import express from 'express';
import { db } from '../config/firebase';
import { authorize, authenticate } from '../middleware/auth';

const router = express.Router();

// Product interface
interface Product {
    id?: string;
    name: string;
    description: string;
    price: number;
    vendorId: string;
    category: string;
    createdAt: Date;
}

// Create product (Vendor only)
router.post(
    '/',
    authenticate,
    authorize(['vendor']),
    async (req, res) => {
        try {
            const { name, description, price, category } = req.body as {
                name: string;
                description: string;
                price: number;
                category: string;
            };

            if (!req.user) {
                return res.status(401).json({ error: 'Not authorized' });
            }

            const productData: Product = {
                name,
                description,
                price,
                vendorId: req.user.uid,
                category,
                createdAt: new Date(),
            };

            const docRef = await db.collection('products').add(productData);
            const product = await docRef.get();

            res.status(201).json({ id: docRef.id, ...product.data() });
        } catch (error) {
            console.error('Product creation error:', error);
            res.status(500).json({ error: 'Product creation failed' });
        }
    }
);

// Get vendor's products
router.get(
    '/my-products',
    authenticate,
    authorize(['vendor']),
    async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({ error: 'Not authorized' });
            }

            const snapshot = await db
                .collection('products')
                .where('vendorId', '==', req.user.uid)
                .get();

            const products = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            res.json(products);
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    }
);

export default router;