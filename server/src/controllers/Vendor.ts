import { Request, Response } from 'express';
import { createProduct, getProductsByVendor } from '../models/Product';

export const createProductListing = async (req: Request, res: Response) => {
    try {
        const { name, price } = req.body;
        const vendorId = req.user!.id || ''; // From auth middleware

        const product = await createProduct({
            name,
            price,
            vendorId,
        });

        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create product' });
    }
};

export const getMyProducts = async (req: Request, res: Response) => {
    try {
        const vendorId = req.user!.id || '';
        const products = await getProductsByVendor(vendorId);
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch products' });
    }
};