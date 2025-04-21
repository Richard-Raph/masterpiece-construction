import { FaBoxOpen, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

interface Product {
    id: string;
    name: string;
    price: number;
    stock: number;
    description?: string;
    status?: string;
}

interface ProductListProps {
    products: Product[];
    error?: string | null;
    onRetry?: () => void;
    isLoading?: boolean;
}

export default function ProductList({
    products,
    error,
    onRetry,
    isLoading
}: ProductListProps) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-mp-light">
            <div className="flex items-center mb-6">
                <FaBoxOpen className="text-2xl text-mp-primary mr-3" />
                <h2 className="text-xl font-semibold text-mp-dark">Your Products</h2>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                    <FaSpinner className="animate-spin text-2xl text-mp-primary mb-2" />
                    <p className="text-mp-gray">Loading products...</p>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 p-4 rounded-md">
                    <div className="flex items-center text-red-600">
                        <FaExclamationTriangle className="mr-2" />
                        <span>{error}</span>
                    </div>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="mt-2 px-3 py-1 bg-red-100 text-red-600 rounded-md text-sm hover:bg-red-200 transition-colors"
                        >
                            Retry Loading
                        </button>
                    )}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-6">
                    <p className="text-mp-gray mb-4">No products found</p>
                    <p className="text-sm text-mp-gray">Create your first product to get started</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className={`p-4 border rounded-md transition-colors ${product.status === 'inactive' ? 'border-gray-200 bg-gray-50' :
                                    product.status === 'out_of_stock' ? 'border-yellow-200 bg-yellow-50' :
                                        'border-mp-light hover:border-mp-primary'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-mp-dark flex items-center">
                                        {product.name}
                                        {product.status !== 'active' && (
                                            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-opacity-20 ${
                                                product.status === 'inactive' ? 'bg-gray-500 text-gray-700' :
                                                'bg-yellow-500 text-yellow-700'
                                            }">
                                                {product.status?.replace('_', ' ') || 'unknown'}
                                            </span>
                                        )}
                                    </h3>
                                    <p className="text-mp-gray text-sm">${product.price.toFixed(2)}</p>
                                    {product.description && (
                                        <p className="text-mp-gray text-sm mt-1">{product.description}</p>
                                    )}
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${product.stock > 5 ? 'bg-green-100 text-green-800' :
                                        product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                    }`}>
                                    {product.stock} in stock
                                </span>
                            </div>
                            <div className="mt-2 flex space-x-2">
                                <button className="text-sm text-mp-primary hover:underline">Edit</button>
                                <button className="text-sm text-red-500 hover:underline">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}