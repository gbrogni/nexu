import React from "react";

interface NexuLogoProps {
  variant?: "wordmark" | "icon" | "with-slogan";
  theme?: "light" | "dark";
  className?: string;
}

export function NexuLogo({ 
  variant = "wordmark", 
  theme = "light",
  className = "" 
}: NexuLogoProps) {
  const color = theme === "dark" ? "#F9FAFB" : "#101828";
  
  if (variant === "icon") {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 512 512" 
        fill="none"
        className={className}
      >
        <path 
          d="M128 128 L236 236" 
          stroke={color} 
          strokeWidth="72" 
          strokeLinecap="round"
        />
        <path 
          d="M276 276 L384 384" 
          stroke={color} 
          strokeWidth="72" 
          strokeLinecap="round"
        />
        <path 
          d="M384 128 L276 236" 
          stroke={color} 
          strokeWidth="72" 
          strokeLinecap="round"
        />
        <path 
          d="M236 276 L128 384" 
          stroke={color} 
          strokeWidth="72" 
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 512 512" 
        fill="none"
        className="w-8 h-8"
      >
        <path 
          d="M128 128 L236 236" 
          stroke={color} 
          strokeWidth="72" 
          strokeLinecap="round"
        />
        <path 
          d="M276 276 L384 384" 
          stroke={color} 
          strokeWidth="72" 
          strokeLinecap="round"
        />
        <path 
          d="M384 128 L276 236" 
          stroke={color} 
          strokeWidth="72" 
          strokeLinecap="round"
        />
        <path 
          d="M236 276 L128 384" 
          stroke={color} 
          strokeWidth="72" 
          strokeLinecap="round"
        />
      </svg>
      <div className="flex flex-col">
        <span 
          className="text-2xl font-semibold tracking-tight" 
          style={{ color }}
        >
          Nexu
        </span>
        {variant === "with-slogan" && (
          <span 
            className="text-xs tracking-wide" 
            style={{ color: theme === "dark" ? "#9CA3AF" : "#344054" }}
          >
            A inteligência por trás de cada pedido.
          </span>
        )}
      </div>
    </div>
  );
}