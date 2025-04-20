import { db } from '../config/firebase';

export const createProduct = async (productData: {
    name: string;
    price: number;
    vendorId: string;
    description: string;
}) => {
    const product = {
        ...productData,
        createdAt: new Date(),
    };
    const docRef = await db.collection('products').add(product);
    return { id: docRef.id, ...product };
};