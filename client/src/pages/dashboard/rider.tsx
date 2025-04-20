import Head from 'next/head';
import { getTime } from '@/libs/time';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { FaTruck, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

export default function RiderDashboard() {
    const { user } = useAuth();

    // Mock delivery data
    const deliveries = [
        { id: 1, from: 'Vendor A', to: 'Construction Site X', time: '10:00 AM', status: 'pending' },
        { id: 2, from: 'Vendor B', to: 'Construction Site Y', time: '2:00 PM', status: 'in-progress' },
        { id: 3, from: 'Vendor C', to: 'Construction Site Z', time: '4:30 PM', status: 'scheduled' },
    ];

    return (
        <ProtectedRoute allowedRoles={['rider']}>
            <Head>
                <title>Rider Dashboard | Masterpiece Construction</title>
                <meta name="description" content="Rider dashboard for delivery management" />
            </Head>

            <section className="min-h-screen bg-mp-light">
                <Navbar />
                <div className="max-w-7xl mx-auto p-4 md:p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-mp-dark">Welcome Rider</h1>
                            <p className="text-mp-gray">{getTime()}, {user?.email}</p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <button className="bg-mp-muted cursor-pointer text-mp-dark px-4 py-2 rounded-md hover:bg-[#f6c834]! transition-colors">
                                View All Deliveries
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 border-b border-mp-light">
                            <div className="flex items-center">
                                <FaCalendarAlt className="text-2xl text-mp-primary mr-3" />
                                <h2 className="text-xl font-semibold text-mp-dark">Today&apos;s Delivery Schedule</h2>
                            </div>
                        </div>

                        <div className="divide-y divide-mp-light">
                            {deliveries.map((delivery) => (
                                <div key={delivery.id} className="p-6 hover:bg-mp-light/50 transition-colors">
                                    <div className="flex items-start">
                                        <div className={`p-2 rounded-full mr-4 ${delivery.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                                            delivery.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                                                'bg-green-100 text-green-600'
                                            }`}>
                                            <FaTruck />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-mp-dark">{delivery.from} → {delivery.to}</h3>
                                            <p className="text-mp-gray flex items-center mt-1">
                                                <FaMapMarkerAlt className="mr-1 text-sm" />
                                                {delivery.time}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${delivery.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            delivery.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                'bg-green-100 text-green-800'
                                            }`}>
                                            {delivery.status.replace('-', ' ')}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </ProtectedRoute>
    );
}
