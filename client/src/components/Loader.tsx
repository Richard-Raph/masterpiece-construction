import { FaSpinner } from 'react-icons/fa';

export default function Loader({
    size = 'md',
    className = "",
    text = 'Loading...'
}: {
    text?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}) {
    const sizeClasses = {
        sm: 'h-5 w-5',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    return (
        <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
            <FaSpinner
                className={`${sizeClasses[size]} text-mp-primary animate-spin ${!text ? 'mx-auto' : ''}`}
            />
            {text && <span className="text-mp-light">{text}</span>}
        </div>
    );
}