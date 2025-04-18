import ProtectedRoute from '../../components/ProtectedRoute';

export default function Buyer() {
    return (
        <ProtectedRoute allowedRoles={['buyer']}>
            <div className="p-8">
                <h1 className="text-2xl font-bold">Welcome Buyer!</h1>
                <p className="mt-2">Access the marketplace.</p>
            </div>
        </ProtectedRoute>
    );
}