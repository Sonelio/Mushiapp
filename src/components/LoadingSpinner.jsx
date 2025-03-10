export default function LoadingSpinner({ size = "medium" }) {
    const sizeClasses = {
      small: "w-5 h-5",
      medium: "w-8 h-8",
      large: "w-12 h-12",
    };
    
    return (
      <div className="flex items-center justify-center">
        <div className={`${sizeClasses[size]} border-4 border-[#11231C] border-t-white rounded-full animate-spin`}></div>
      </div>
    );
  }