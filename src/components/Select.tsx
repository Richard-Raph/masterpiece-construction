import { FaUserShield } from 'react-icons/fa';
import { UserRole } from '@/contexts/AuthContext';

interface SelectProps {
    role: UserRole;
    setRole: (role: UserRole) => void;
}

const roleOptions: UserRole[] = ['buyer', 'vendor', 'rider'];

export default function Select({ role, setRole }: SelectProps) {
    return (
        <div className="mb-6">
            <label className="text-sm font-medium text-mp-dark mb-2 flex items-center">
                <FaUserShield className="mr-2 text-mp-primary" />
                I am a...
            </label>
            <div className="grid grid-cols-3 gap-3">
                {roleOptions.map((option) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => setRole(option)}
                        aria-label={`Select ${option} role`}
                        className={`py-2 px-3 rounded-md cursor-pointer border transition-colors ${role === option
                            ? 'border-mp-primary text-mp-primary'
                            : 'border-gray-300 hover:border-mp-primary'
                            }`}
                    >
                        {option.charAt(0).toUpperCase() + option.slice(1)}
                    </button>
                ))}
            </div>
        </div>
    );
}
