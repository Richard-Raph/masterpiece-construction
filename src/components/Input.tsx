import { useState } from 'react';
import { FaEye, FaTag, FaLock, FaUser, FaFileAlt, FaEyeSlash, FaEnvelope, FaDollarSign } from 'react-icons/fa';

interface InputProps {
    id: string;
    name: string;
    type?: string;
    rows?: number;
    label: string;
    value: string;
    textarea?: boolean;
    placeholder: string;
    onClick: (e: React.MouseEvent<HTMLInputElement>) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    icon?: 'text' | 'email' | 'password' | 'productName' | 'productPrice' | 'productDescription';
}

export default function Input({
    id,
    icon,
    name,
    label,
    value,
    onClick,
    rows = 3,
    onChange,
    placeholder,
    type = 'text',
    textarea = false,
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(prev => !prev);
    };

    const Icon = () => {
        switch (icon) {
            case 'productPrice':
                return <FaDollarSign className="w-4 h-4 mr-2 text-mp-primary" />;
            case 'email':
                return <FaEnvelope className="w-4 h-4 mr-2 text-mp-primary" />;
            case 'productDescription':
                return <FaFileAlt className="w-4 h-4 mr-2 text-mp-primary" />;
            case 'password':
                return <FaLock className="w-4 h-4 mr-2 text-mp-primary" />;
            case 'text':
                return <FaUser className="w-4 h-4 mr-2 text-mp-primary" />;
            case 'productName':
                return <FaTag className="w-4 h-4 mr-2 text-mp-primary" />;
            default:
                return null;
        }
    };

    return (
        <div className="mb-6 relative">
            <label htmlFor={id} className="text-sm font-medium text-mp-dark mb-2 flex items-center">
                <Icon />
                {label}
            </label>
            {textarea ? (
                <textarea
                    id={id}
                    required
                    name={name}
                    rows={rows}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full p-3 border outline-none text-mp-gray border-gray-300 rounded-md focus:ring-1 focus:ring-[#f6c834] focus:border-transparent"
                />
            ) : (<>
                <input
                    id={id}
                    required
                    name={name}
                    value={value}
                    onClick={onClick}
                    onChange={onChange}
                    placeholder={placeholder}
                    type={icon === 'password' ? (showPassword ? 'text' : 'password') : type}
                    className="w-full p-3 border outline-none text-mp-gray border-gray-300 rounded-md focus:ring-1 focus:ring-[#f6c834] focus:border-transparent"
                />
                {icon === 'password' && (showPassword ? <FaEyeSlash onClick={togglePassword} className="absolute right-5 bottom-4 cursor-pointer hover:text-[#e0bb4b]" /> : <FaEye onClick={togglePassword} className="absolute right-5 bottom-4 cursor-pointer hover:text-[#e0bb4b]" />)}
            </>)}
        </div>
    );
}
