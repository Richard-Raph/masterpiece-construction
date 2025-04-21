import Head from 'next/head';
import { getTime } from '@/libs/time';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FaShoppingCart, FaSearch, FaStore } from 'react-icons/fa';

export default function Buyer() {
    const { user } = useAuth();

    return (
        <ProtectedRoute allowedRoles={['buyer']}>
            <Head>
                <title>Buyer Dashboard | Masterpiece Construction</title>
                <meta name="description" content="Buyer dashboard for construction marketplace" />
            </Head>

            <section className="min-h-screen bg-mp-light">
                <Navbar />
                <div className="max-w-7xl mx-auto p-4 md:p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-mp-dark">Welcome Buyer</h1>
                            <p className="text-mp-gray">{getTime()}, {user?.name?.split(' ')[0].toLowerCase().replace(/^\w/, c => c.toUpperCase())}</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <button className="cursor-pointer bg-mp-muted text-mp-dark px-4 py-2 rounded-md hover:bg-[#f6c834]! transition-colors">
                                Browse Marketplace
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Marketplace Card */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-mp-light hover:border-mp-primary transition-colors">
                            <div className="flex items-center mb-4">
                                <FaStore className="text-2xl text-mp-primary mr-3" />
                                <h2 className="text-xl font-semibold text-mp-dark">Marketplace</h2>
                            </div>
                            <p className="text-mp-gray mb-4">Find quality materials and services for your projects</p>
                            <button className="cursor-pointer text-mp-primary hover:underline">Explore now</button>
                        </div>

                        {/* Search Card */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-mp-light hover:border-mp-primary transition-colors">
                            <div className="flex items-center mb-4">
                                <FaSearch className="text-2xl text-mp-primary mr-3" />
                                <h2 className="text-xl font-semibold text-mp-dark">Advanced Search</h2>
                            </div>
                            <p className="text-mp-gray mb-4">Filter vendors by location, ratings, and specialties</p>
                            <button className="cursor-pointer text-mp-primary hover:underline">Search vendors</button>
                        </div>

                        {/* Orders Card */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-mp-light hover:border-mp-primary transition-colors">
                            <div className="flex items-center mb-4">
                                <FaShoppingCart className="text-2xl text-mp-primary mr-3" />
                                <h2 className="text-xl font-semibold text-mp-dark">Your Orders</h2>
                            </div>
                            <p className="text-mp-gray mb-4">Track and manage your current orders</p>
                            <button className="cursor-pointer text-mp-primary hover:underline">View orders</button>
                        </div>
                    </div>
                </div>
            </section>
        </ProtectedRoute>
    );
}
