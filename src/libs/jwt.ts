// import { auth } from "./firebase";


// export const getAuthToken = async (): Promise<string> => {
//     const user = auth.currentUser;
//     if (!user) throw new Error('User not authenticated');
    
//     try {
//         // Get Firebase ID token (automatically handles refresh if needed)
//         return await user.getIdToken(true);
//     } catch (error) {
//         console.error('Error getting auth token:', error);
//         throw new Error('Authentication failed');
//     }
// };