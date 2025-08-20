export default function LoadingSpinner({ 
  size = 'medium',
  color = 'black' 
}: { 
  size?: 'small' | 'medium' | 'large',
  color?: 'black' | 'white' 
}) {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  };

  const borderColor = color === 'white' 
    ? 'border-gray-300 border-t-white' 
    : 'border-gray-200 border-t-black';

  return (
    <div className="flex items-center justify-center">
      <div 
        className={`${sizeClasses[size]} border-4 ${borderColor} rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}