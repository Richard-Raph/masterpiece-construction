import { FaLock, FaEnvelope } from 'react-icons/fa';

interface InputProps {
    type: string;
    label: string;
    value: string;
    placeholder: string;
    icon?: 'email' | 'password';
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
    icon,
    type,
    label,
    value,
    onChange,
    placeholder,
}: InputProps) {
    const getIcon = () => {
        switch (icon) {
            case 'email':
                return <FaEnvelope className="w-5 h-5 mr-2 text-mp-primary" />;
            case 'password':
                return <FaLock className="w-5 h-5 mr-2 text-mp-primary" />;
            default:
                return null;
        }
    };

    return (
        <div className="mb-6">
            <label className="text-sm font-medium text-mp-dark mb-2 flex items-center">
                {getIcon()}
                {label}
            </label>
            <input
                type={type}
                value={value}
                required={true}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full p-3 border outline-none text-mp-gray border-gray-300 rounded-md focus:ring-2 focus:ring-[#f6c834] focus:border-transparent"
            />
        </div>
    );
}
