export const getFirebaseErrorMessage = (error: unknown): string => {
    const err = error as { code?: string; message?: string };

    if (!err.code) return err.message || 'An unknown error occurred';

    switch (err.code) {
        // Authentication Errors
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please use a different email or login.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/missing-password':
            return 'Please enter your password.';
        case 'auth/missing-email':
            return 'Please enter your email address.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/too-many-requests':
            return 'Too many attempts. Please try again later.';
        case 'auth/account-exists-with-different-credential':
            return 'An account already exists with this email.';
        case 'auth/requires-recent-login':
            return 'Please login again to perform this action.';
        case 'auth/user-disabled':
            return 'This account has been disabled.';
        case 'auth/operation-not-allowed':
            return 'This operation is not allowed.';
        case 'auth/invalid-credential':
            return 'Invalid login credentials.';
        case 'auth/invalid-verification-code':
            return 'Invalid verification code.';
        case 'auth/invalid-verification-id':
            return 'Invalid verification ID.';

        // Firestore Errors
        case 'permission-denied':
            return 'You don\'t have permission to perform this action.';
        case 'not-found':
            return 'The requested document was not found.';
        case 'unavailable':
            return 'Service is unavailable. Please check your connection.';
        case 'deadline-exceeded':
            return 'The operation timed out. Please try again.';

        // General Errors
        case 'auth/network-request-failed':
            return 'Network error. Please check your internet connection.';
        case 'auth/internal-error':
            return 'Internal server error. Please try again later.';
        case 'auth/invalid-api-key':
            return 'Invalid API key. Please contact support.';
        case 'auth/app-not-authorized':
            return 'Application not authorized to use Firebase Authentication.';
        case 'auth/invalid-user-token':
            return 'Your session has expired. Please login again.';
        case 'auth/user-token-expired':
            return 'Your session has expired. Please login again.';

        default:
            // For unhandled error codes, return a generic message with the code for debugging
            return `An error occurred (${err.code}). Please try again.`;
    }
};