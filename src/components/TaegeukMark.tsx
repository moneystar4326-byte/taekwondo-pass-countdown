import React from 'react';

// Brand mark: taegeuk (red over blue) in a white ring
export const TaegeukMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
    <circle cx="50" cy="50" r="48" fill="#ffffff" />
    <circle cx="50" cy="50" r="42" fill="var(--color-brand-blue)" />
    <path
      d="M8 50 A42 42 0 0 1 92 50 A21 21 0 0 1 50 50 A21 21 0 0 0 8 50 Z"
      fill="var(--color-brand-red)"
    />
  </svg>
);
