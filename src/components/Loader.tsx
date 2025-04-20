import { FaSpinner } from 'react-icons/fa';

export default function Loader({
    size = 'md',
    className = "",
    text = 'Loading...',
    textClass = "text-mp-light",
    spinnerClass = "text-mp-primary",
}: {
    text?: string;
    className?: string;
    textClass?: string;
    spinnerClass?: string;
    size?: 'sm' | 'md' | 'lg';
}) {
    const sizeClasses = {
        sm: 'h-5 w-5',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    return (
        <div className={`flex flex-col items-center justify-center space-y-3 ${className}`}>
            <FaSpinner className={`${sizeClasses[size]} ${spinnerClass} animate-spin ${!text ? 'mx-auto' : ''}`} />
            {text && <span className={textClass}>{text}</span>}
        </div>
    );
}