import Link from "next/link";
import { RoleCardType } from "@/types/types";
import { FaTruck, FaHardHat, FaShoppingCart } from 'react-icons/fa';

export default function RoleCard({ title, description }: RoleCardType) {
    const getIcon = () => {
        switch (title) {
            case 'Rider': return <FaTruck className="text-3xl" />;
            case 'Vendor': return <FaHardHat className="text-3xl" />;
            case 'Buyer': return <FaShoppingCart className="text-3xl" />;
            default: return null;
        }
    };

    return (
        <Link href='/auth/register'>
            <div className={`group relative h-full rounded-xl overflow-hidden border-t-4 hover:border-[#f6c834]! transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                <div className="bg-mp-light p-8 h-full flex flex-col items-center text-center">
                    <div className="mb-6 p-4 rounded-full bg-gradient-to-br from-mp-primary to-mp-muted group-hover:bg-gradient-to-br group-hover:from-mp-muted group-hover:to-mp-primary transition-all duration-300">
                        <span className="text-white" aria-hidden>
                            {getIcon()}
                        </span>
                    </div>

                    <h3 className="text-2xl font-bold mb-3 text-mp-dark">{title}</h3>
                    <p className="text-mp-gray mb-6">{description}</p>

                    <div className="mt-auto w-full">
                        <button
                            type="button" className="w-full py-2 px-4 bg-mp-muted text-mp-dark text-md cursor-pointer font-medium rounded-md transition-colors duration-200 group-hover:bg-[#f6c834]!"
                        >
                            Join as {title}
                        </button>
                    </div>
                </div>

                <div className="absolute inset-0 border-2 border-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
        </Link>
    );
}
