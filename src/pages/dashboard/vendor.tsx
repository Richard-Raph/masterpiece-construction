import Head from 'next/head';
import { useState } from 'react';
import { getTime } from '@/libs/time';
import { auth } from '@/libs/firebase';
import Loader from '@/components/Loader';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useToaster } from '@/components/Toaster';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FaBoxOpen, FaPlus, FaChartLine } from 'react-icons/fa';

export default function VendorDashboard() {
    const { user } = useAuth();
    const { showToast } = useToaster();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [productName, setProductName] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productDescription, setProductDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = await auth.currentUser?.getIdToken();
            if (!token) {
                throw new Error('Not authenticated');
            }

            const response = await fetch('/api/products/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: productName,
                    price: parseFloat(productPrice),
                    description: productDescription,
                }),
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            showToast('Product created successfully!', 'success');
            setProductName('');
            setProductPrice('');
            setProductDescription('');
        } catch (err) {
            const error = err instanceof Error ? err.message : 'Failed to create product';
            showToast(error, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Mock products data
    const products = [
        { id: 1, name: 'Steel Beams', price: 89.50, stock: 35 },
        { id: 2, name: 'Concrete Mix', price: 45.99, stock: 120 },
        { id: 3, name: 'Roofing Tiles', price: 12.75, stock: 240 },
    ];

    return (
        <ProtectedRoute allowedRoles={['vendor']}>
            <Head>
                <title>Vendor Dashboard | Masterpiece Construction</title>
                <meta name="description" content="Vendor dashboard for product management" />
            </Head>

            <section className="min-h-screen bg-mp-light">
                <Navbar />
                <div className="max-w-7xl mx-auto p-4 md:p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-mp-dark">Welcome Vendor</h1>
                            <p className="text-mp-gray">{getTime()}, {user?.email}</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-3">
                            <button className="cursor-pointer bg-mp-muted text-mp-dark px-4 py-2 rounded-md hover:bg-[#f6c834]!  transition-colors flex items-center">
                                <FaChartLine className="mr-2" /> Analytics
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Stats Card */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-mp-light">
                            <h3 className="text-mp-gray mb-2">Total Products</h3>
                            <p className="text-3xl font-bold text-mp-dark">24</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-mp-light">
                            <h3 className="text-mp-gray mb-2">Orders Today</h3>
                            <p className="text-3xl font-bold text-mp-dark">8</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-mp-light">
                            <h3 className="text-mp-gray mb-2">Revenue</h3>
                            <p className="text-3xl font-bold text-mp-dark">$2,450</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Add Product Form */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-mp-light">
                            <div className="flex items-center mb-6">
                                <FaPlus className="text-2xl text-mp-primary mr-3" />
                                <h2 className="text-xl font-semibold text-mp-dark">Add New Product</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-mp-dark mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-mp-primary focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-mp-dark mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        value={productPrice}
                                        onChange={(e) => setProductPrice(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-mp-primary focus:border-transparent"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-mp-dark mb-1">Description</label>
                                    <textarea
                                        value={productDescription}
                                        onChange={(e) => setProductDescription(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-mp-primary focus:border-transparent"
                                        rows={3}
                                        required
                                    />
                                </div>

                                {error && <div className="text-red-500 text-sm">{error}</div>}
                                {success && <div className="text-green-500 text-sm">{success}</div>}

                                {isLoading && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                        <Loader text="Creating product..." size="lg" />
                                    </div>
                                )}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="cursor-pointer w-full bg-gradient-to-r from-mp-primary to-mp-muted text-mp-dark font-medium py-3 px-4 rounded-md hover:from-[#e0bb4b]! hover:to-[#f6c834]! transition-all duration-300 disabled:opacity-75 flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader size="sm" text="" className="mr-2" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Product'
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Product List */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-mp-light">
                            <div className="flex items-center mb-6">
                                <FaBoxOpen className="text-2xl text-mp-primary mr-3" />
                                <h2 className="text-xl font-semibold text-mp-dark">Your Products</h2>
                            </div>

                            <div className="space-y-4">
                                {products.map((product) => (
                                    <div key={product.id} className="p-4 border border-mp-light rounded-md hover:border-mp-primary transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-mp-dark">{product.name}</h3>
                                                <p className="text-mp-gray text-sm">${product.price.toFixed(2)}</p>
                                            </div>
                                            <span className="bg-mp-light text-mp-dark text-xs px-2 py-1 rounded">
                                                {product.stock} in stock
                                            </span>
                                        </div>
                                        <div className="mt-2 flex space-x-2">
                                            <button className="cursor-pointer text-sm text-mp-primary hover:underline">Edit</button>
                                            <button className="cursor-pointer text-sm text-red-500 hover:underline">Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </ProtectedRoute>
    );
}
