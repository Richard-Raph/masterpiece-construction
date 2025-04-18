import { FaUserShield } from 'react-icons/fa';

interface SelectProps {
    role: string;
    setRole: (role: 'buyer' | 'vendor' | 'rider') => void;
}

export default function Select({ role, setRole }: SelectProps) {
    return (
        <div className="mb-6">
            <label className="text-sm font-medium text-mp-dark mb-2 flex items-center">
                <FaUserShield className="mr-2 text-mp-primary" />
                I am a...
            </label>
            <div className="grid grid-cols-3 gap-3">
                {['buyer', 'vendor', 'rider'].map((r) => (
                    <button
                        key={r}
                        type="button"
                        onClick={() => setRole(r as 'buyer' | 'vendor' | 'rider')}
                        className={`py-2 px-3 cursor-pointer rounded-md border transition-colors ${role === r
                                ? 'border-mp-primary bg-mp-primary/10 text-mp-primary'
                                : 'border-gray-300 hover:border-mp-muted'
                            }`}
                    >
                        {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                ))}
            </div>
        </div>
    );
}
