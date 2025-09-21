import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex flex-col items-end ${className}`}>
      <span className={`font-bold ${textSizeClasses[size]} text-foreground`}>
        CarSell<span className="text-red-500">Max</span>
      </span>
      <span className={`text-xs text-muted-foreground italic ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}`}>
        Atlanta
      </span>
    </div>
  );
}
