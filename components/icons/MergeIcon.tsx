
import React from 'react';

export const MergeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h6a2 2 0 012 2v1" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 16h6a2 2 0 002-2v-1" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 12h6m0 0l-3-3m3 3l-3 3" />
  </svg>
);
