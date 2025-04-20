import { FaLock, FaEnvelope } from 'react-icons/fa';

interface InputProps {
    id: string;
    type: string;
    label: string;
    value: string;
    required?: boolean;
    placeholder: string;
    icon?: 'email' | 'password';
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
    id,
    icon,
    type,
    label,
    value,
    onChange,
    placeholder,
    required = true,
}: InputProps) {
    const Icon = () => {
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
            <label htmlFor={id} className="text-sm font-medium text-mp-dark mb-2 flex items-center">
                <Icon />
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className="w-full p-3 border outline-none text-mp-gray border-gray-300 rounded-md focus:ring-1 focus:ring-[#f6c834] focus:border-transparent"
            />
        </div>
    );
}
