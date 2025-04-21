import Head from 'next/head';
import { getTime } from '@/libs/time';
import Input from '@/components/Input';
import { useRouter } from 'next/router';
import Loader from '@/components/Loader';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useToaster } from '@/components/Toaster';
import ProductList from '@/components/ProductList';
import { FaPlus, FaChartLine } from 'react-icons/fa';
import { useCallback, useEffect, useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    status?: string;
    description?: string;
}

export default function Vendor() {
    const router = useRouter();
    const { showToast } = useToaster();
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);
    const [productsError, setProductsError] = useState<string | null>(null);
    const { user, loading: authLoading, logout } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
    });

    const fetchProducts = useCallback(async () => {
        if (!user) return;

        setIsLoadingProducts(true);
        setProductsError(null);

        try {
            const response = await fetch(`/api/products?userId=${user.uid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const contentType = response.headers.get('content-type');
            if (!contentType?.includes('application/json')) {
                const text = await response.text();
                throw new Error(
                    text.includes('<!DOCTYPE html>')
                        ? 'Server error: Received HTML instead of JSON'
                        : text.substring(0, 100)
                );
            }

            const data = await response.json();

            if (!response.ok) {
                console.error('Fetch products error:', data);
                if (['auth/user-not-found', 'auth/not-vendor', 'auth/missing-user-id', 'auth/invalid-user-id'].includes(data.code)) {
                    showToast(data.error || 'Access denied. Please log in again.', 'error');
                    await logout();
                    router.push('/auth/login');
                    return;
                }
                throw new Error(data.error || 'Failed to fetch products');
            }

            setProducts(data.products || []);
        } catch (error) {
            console.error('Fetch products error:', error);
            setProductsError(
                error instanceof Error ? error.message : 'Failed to load products'
            );
            showToast(
                error instanceof Error ? error.message : 'Failed to load products',
                'error'
            );
        } finally {
            setIsLoadingProducts(false);
        }
    }, [user, logout, router, showToast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            showToast('User not authenticated', 'error');
            return;
        }

        const name = formData.name.trim();
        const price = parseFloat(formData.price);
        if (!name || name.length < 2 || isNaN(price) || price <= 0) {
            showToast('Please enter a valid product name (2+ characters) and price (>0)', 'error');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/products/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.uid,
                    name,
                    price,
                    description: formData.description.trim(),
                }),
            });

            const contentType = response.headers.get('content-type');
            if (!contentType?.includes('application/json')) {
                const text = await response.text();
                throw new Error(
                    text.includes('<!DOCTYPE html>')
                        ? 'Server error: Received HTML instead of JSON'
                        : text.substring(0, 100)
                );
            }

            const data = await response.json();

            if (!response.ok) {
                console.error('Create product error:', data);
                if (['auth/user-not-found', 'auth/not-vendor', 'auth/missing-user-id', 'auth/invalid-user-id'].includes(data.code)) {
                    showToast(data.error || 'Access denied. Please log in again.', 'error');
                    await logout();
                    router.push('/auth/login');
                    return;
                }
                throw new Error(data.error || 'Failed to create product');
            }

            showToast('Product created successfully!', 'success');
            setFormData({ name: '', price: '', description: '' });
            await fetchProducts();
        } catch (error) {
            console.error('Create product error:', error);
            showToast(
                error instanceof Error ? error.message : 'Failed to create product',
                'error'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (user?.role === 'vendor') {
            fetchProducts();
        }
    }, [user, fetchProducts]);

    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader size="lg" text="Loading dashboard..." />
            </div>
        );
    }

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
                            <p className="text-mp-gray">{getTime()}, {user?.name?.split(' ')[0].toLowerCase().replace(/^\w/, c => c.toUpperCase())}</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-3">
                            <button className="cursor-pointer bg-mp-muted text-mp-dark px-4 py-2 rounded-md hover:bg-[#f6c834]! transition-colors flex items-center">
                                <FaChartLine className="mr-2" /> Analytics
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-xl shadow-md border border-mp-light">
                            <h3 className="text-mp-gray mb-2">Total Products</h3>
                            <p className="text-3xl font-bold text-mp-dark">{products.length}</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-mp-light">
                            <h3 className="text-mp-gray mb-2">Orders Today</h3>
                            <p className="text-3xl font-bold text-mp-dark">0</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md border border-mp-light">
                            <h3 className="text-mp-gray mb-2">Revenue</h3>
                            <p className="text-3xl font-bold text-mp-dark">$0</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-md border border-mp-light">
                            <div className="flex items-center mb-6">
                                <FaPlus className="text-2xl text-mp-primary mr-3" />
                                <h2 className="text-xl font-semibold text-mp-dark">Add New Product</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input
                                    name="name"
                                    type="text"
                                    id="productName"
                                    icon="productName"
                                    label="Product Name*"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter product name"
                                />

                                <Input
                                    name="price"
                                    type="number"
                                    id="productPrice"
                                    label="Price ($)*"
                                    placeholder="0.00"
                                    icon="productPrice"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                />

                                <Input
                                    rows={2}
                                    textarea
                                    name="description"
                                    label="Description"
                                    id="productDescription"
                                    icon="productDescription"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Enter product description"
                                />

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full cursor-pointer bg-gradient-to-r from-mp-primary to-mp-muted text-mp-dark font-medium py-3 px-4 rounded-md hover:from-[#e0bb4b] hover:to-[#f6c834] transition-all duration-300 disabled:opacity-75 flex items-center justify-center"
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

                        <ProductList
                            products={products}
                            error={productsError}
                            onRetry={fetchProducts}
                            isLoading={isLoadingProducts}
                        />
                    </div>
                </div>

                {isLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <Loader text="Processing..." size="lg" />
                    </div>
                )}
            </section>
        </ProtectedRoute>
    );
}