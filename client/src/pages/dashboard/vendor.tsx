import ProtectedRoute from '../../components/ProtectedRoute';

export default function Vendor() {
    return (
        <ProtectedRoute allowedRoles={['vendor']}>
            <div className="p-8">
                <h1 className="text-2xl font-bold">Welcome Vendor!</h1>
                <p className="mt-2">Manage your listings.</p>
            </div>
        </ProtectedRoute>
    );
}