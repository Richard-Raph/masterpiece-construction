import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function VendorDashboard() {
    const { user } = useAuth();

    return (
        <ProtectedRoute allowedRoles={['buyer']}>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Buyer Dashboard</h1>
                <p className="mb-6">Welcome, {user?.email}</p>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Get a Product</h2>
                </div>
            </div>
        </ProtectedRoute>
    );
}