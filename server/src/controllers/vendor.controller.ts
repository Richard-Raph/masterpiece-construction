import { Response } from 'express';
import { firestore } from '../config/firebase';
import { Product } from '../models/product.model';

export const createProduct = async (req: any, res: Response) => {
    const { title, description, price } = req.body;

    if (!title || !description || price === undefined) {
        return res.status(400).json({ error: 'Title, description, and price are required' });
    }

    try {
        const newProduct: Product = {
            vendorId: req.user.uid,
            title,
            description,
            price: parseFloat(price),
        };

        const docRef = await firestore.collection('products').add(newProduct);

        res.status(201).json({ message: 'Product created', productId: docRef.id });
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Failed to create product' });
    }
};

export const listProducts = async (req: any, res: Response) => {
    try {
        const snapshot = await firestore
            .collection('products')
            .where('vendorId', '==', req.user.uid)
            .get();

        const products = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.status(200).json({ products });
    } catch (err: any) {
        res.status(500).json({ error: err.message || 'Failed to fetch products' });
    }
};