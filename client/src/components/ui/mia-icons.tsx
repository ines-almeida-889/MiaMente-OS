// Mia Mente Brand Icons - inspired by brand guidelines
import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

export function HappyFaceIcon({ size = 24, className = "" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      className={className}
      fill="none"
    >
      <circle cx="12" cy="12" r="10" fill="var(--mia-pink)" opacity="0.8"/>
      <circle cx="9" cy="9" r="1.5" fill="var(--mia-navy)"/>
      <circle cx="15" cy="9" r="1.5" fill="var(--mia-navy)"/>
      <path 
        d="M8 14c0 2.21 1.79 4 4 4s4-1.79 4-4" 
        stroke="var(--mia-navy)" 
        strokeWidth="2" 
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function MoonStarIcon({ size = 24, className = "" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      className={className}
      fill="none"
    >
      <path 
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
        fill="var(--mia-yellow)" 
        opacity="0.9"
      />
      <path 
        d="m16 5 1.5 1.5L19 5l-1.5-1.5L16 5Z" 
        fill="var(--mia-blue)"
      />
      <path 
        d="M20.5 10.5 22 12l-1.5 1.5L19 12l1.5-1.5Z" 
        fill="var(--mia-pink)"
      />
    </svg>
  );
}

export function HeartPulseIcon({ size = 24, className = "" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      className={className}
      fill="none"
    >
      <path 
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
        fill="var(--mia-pink)" 
        opacity="0.8"
      />
      <path 
        d="M2 12h4l2-4 4 8 2-4h4" 
        stroke="var(--mia-navy)" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function BrainIcon({ size = 24, className = "" }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      className={className}
      fill="none"
    >
      <path 
        d="M12 5a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V19a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" 
        fill="var(--mia-blue)" 
        opacity="0.6"
      />
      <circle cx="9" cy="10" r="1" fill="var(--mia-navy)"/>
      <circle cx="15" cy="10" r="1" fill="var(--mia-navy)"/>
      <path 
        d="M8 8c.5-.5 1-.5 1.5 0M14.5 8c.5-.5 1-.5 1.5 0" 
        stroke="var(--mia-pink)" 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  );
}