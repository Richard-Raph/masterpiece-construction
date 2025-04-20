export type UserRole = 'buyer' | 'vendor' | 'rider';

export interface User {
    uid: string;
    email: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    phone?: string;
}

export interface Product {
    id?: string;
    name: string;
    description: string;
    price: number;
    vendorId: string;
    category: string;
    createdAt: Date;
}

export interface Delivery {
    id?: string;
    productId: string;
    buyerId: string;
    vendorId: string;
    riderId?: string;
    status: 'pending' | 'assigned' | 'in-transit' | 'delivered';
    createdAt: Date;
    updatedAt: Date;
}