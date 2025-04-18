import ProtectedRoute from '../../components/ProtectedRoute';

export default function Rider() {
    return (
        <ProtectedRoute allowedRoles={['rider']}>
            <div className="p-8">
                <h1 className="text-2xl font-bold">Welcome Rider!</h1>
                <p className="mt-2">View delivery schedule.</p>
            </div>
        </ProtectedRoute>
    );
}