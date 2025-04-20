// server/src/controllers/buyerController.ts
import { Request, Response } from 'express';

export const viewAvailableProducts = async (req: Request, res: Response) => {
    // Implementation would fetch all products
    res.status(200).json({ message: 'Available products list' });
};