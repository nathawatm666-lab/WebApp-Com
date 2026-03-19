import React from 'react';

// แผนผังไอคอน SVG สำหรับหมวดหมู่ต่างๆ เพื่อความพรีเมียม
export const categoryIcons = {
    'cpu': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <path d="M15 1v3M9 1v3M15 20v3M9 20v3M20 15h3M20 9h3M1 15h3M1 9h3" />
        </svg>
    ),
    'gpu': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <path d="M6 10v4M10 10v4M14 10v4M18 10v4M3 5h18" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ),
    'ram': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M22 14V10c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2z" />
            <path d="M6 8v8M10 8v8M14 8v8M18 8v8M2 12h20" />
        </svg>
    ),
    'storage': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
    ),
    'mainboard': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18M3 9h18M3 15h18M12 9v6M15 9v3" />
        </svg>
    ),
    'psu': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M7 12h4l1 3 3-6h4" />
            <circle cx="18" cy="9" r="1" />
        </svg>
    ),
    'case': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <path d="M8 6h8M8 10h8M16 14v4" />
        </svg>
    ),
    'cooling': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
    ),
    'monitor': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8M12 17v4" />
        </svg>
    ),
    'mouse': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <rect x="6" y="2" width="12" height="20" rx="6" />
            <path d="M12 2v8M6 10h12" />
        </svg>
    ),
    'keyboard': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" />
        </svg>
    ),
    'prebuilt-pc': (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
            <path d="M4 6h16M4 18h16M12 11a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM12 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
        </svg>
    )
};
