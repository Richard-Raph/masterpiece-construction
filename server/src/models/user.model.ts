export interface User {
    uid: string;
    email: string;
    role: 'buyer' | 'vendor' | 'rider';
}