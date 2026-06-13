/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface SmanLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
  textColor?: 'dark' | 'light';
}

export default function SmanLogo({
  className = '',
  size = 48,
  showText = false,
  textColor = 'dark',
}: SmanLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md select-none"
      >
        {/* Outer Shield Frame (Pancasila Shield Shape / Frame Segilima Melengkung) */}
        <path
          d="M50 3 C 65 3, 85 9, 93 25 C 99 38, 97 68, 86 85 C 74 97, 50 97, 50 97 C 50 97, 26 97, 14 85 C 3 68, 1 38, 7 25 C 15 9, 35 3, 50 3 Z"
          fill="#1fb6ff"
          stroke="#ffeb3b"
          strokeWidth="3"
          strokeLinejoin="round"
        />

        {/* Inner Yellow Flower-like pentagonal lobe structure (Bunga Kantil Kuning) */}
        <path
          d="M 50,11 
             C 59,11, 71,18, 77,26 
             C 83,34, 87,47, 83,56 
             C 79,65, 73,73, 63,80 
             C 53,87, 50,88, 50,88 
             C 50,88, 47,87, 37,80 
             C 27,73, 21,65, 17,56 
             C 13,47, 17,34, 23,26 
             C 29,18, 41,11, 50,11 Z"
          fill="#ffeb3b"
          stroke="#ff8f00"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Red Text Path helper arch */}
        <path
          id="sman-text-arc"
          d="M 22,46 A 28,28 0 0,1 78,46"
          fill="none"
        />

        {/* Orange/Brown Star at the top center of the flower */}
        <polygon 
          points="50,22 51.5,25.5 55,25.5 52,27.5 53.5,31 50,29 46.5,31 48,27.5 45,25.5 48.5,25.5" 
          fill="#e65100" 
        />

        {/* Arched text: SMA NEGERI 1 BANTARAN */}
        <text className="font-sans" fontSize="6.2" fontWeight="900" fill="#d32f2f" letterSpacing="0.1">
          <textPath href="#sman-text-arc" startOffset="50%" textAnchor="middle">
            SMA NEGERI 1 BANTARAN
          </textPath>
        </text>

        {/* Core Globe (Bola Dunia) with Red Ring */}
        <circle cx="50" cy="48" r="14.5" fill="none" stroke="#d32f2f" strokeWidth="1.2" />
        <circle cx="50" cy="48" r="13.5" fill="#00b4d8" />
        
        {/* Green Continents Map details */}
        <path d="M42 41 C43 42, 44 38, 46 39 C48 40, 47 43, 49 42 C51 40, 56 42, 55 45 C53 47, 56 49, 52 50 C49 51, 46 48, 44 46 C42 45, 40 43, 42 41 Z" fill="#22c55e" />
        <path d="M45 47 Q48 45, 50 48 T54 47 T57 49 C54 50, 48 50, 45 47 Z" fill="#22c55e" />
        <circle cx="56" cy="41" r="1.2" fill="#22c55e" />
        <circle cx="53" cy="38" r="0.9" fill="#22c55e" />
        <path d="M46 51 Q49 52, 48 53 T52 52 T50 50 Z" fill="#22c55e" />

        {/* Paddy (Rice representation) on the Left */}
        <path d="M38 56 Q33 50, 33 38" fill="none" stroke="#ff8f00" strokeWidth="0.8" strokeLinecap="round" />
        <g fill="#ffc107" stroke="#ff8f00" strokeWidth="0.3">
          <ellipse cx="38" cy="54" rx="1.1" ry="1.7" transform="rotate(-15 38 54)" />
          <ellipse cx="36" cy="51" rx="1.1" ry="1.7" transform="rotate(-25 36 51)" />
          <ellipse cx="34.5" cy="48" rx="1.1" ry="1.7" transform="rotate(-35 34.5 48)" />
          <ellipse cx="33.5" cy="45" rx="1.1" ry="1.7" transform="rotate(-45 33.5 45)" />
          <ellipse cx="33" cy="42" rx="1.1" ry="1.7" transform="rotate(-55 33 42)" />
          <ellipse cx="33" cy="38" rx="1.1" ry="1.7" transform="rotate(-65 33 38)" />
        </g>

        {/* Cotton (Kapas representation) on the Right */}
        <path d="M62 56 Q67 50, 67 38" fill="none" stroke="#2e7d32" strokeWidth="0.8" strokeLinecap="round" />
        <g fill="#ffffff" stroke="#2e7d32" strokeWidth="0.3">
          <circle cx="62" cy="53" r="1.2" />
          <path d="M62.5 53.7 L61.5 53.7 L62 54.3 Z" fill="#2e7d32" />
          
          <circle cx="64" cy="50" r="1.2" />
          <path d="M64.5 50.7 L63.5 50.7 L64 51.3 Z" fill="#2e7d32" />
          
          <circle cx="65.5" cy="47" r="1.2" />
          <path d="M66 47.7 L65 47.7 L65.5 48.3 Z" fill="#2e7d32" />
          
          <circle cx="66.5" cy="44" r="1.2" />
          <path d="M67 44.7 L66 44.7 L66.5 45.3 Z" fill="#2e7d32" />
          
          <circle cx="67" cy="41" r="1.2" />
          <path d="M67.5 41.7 L66.5 41.7 L67 42.3 Z" fill="#2e7d32" />
          
          <circle cx="67" cy="38" r="1.2" />
          <path d="M67.5 38.7 L66.5 38.7 L67 39.3 Z" fill="#2e7d32" />
        </g>

        {/* Open Book (Metofor Kitab) with Pen nib (Pena kayu emas) */}
        <path
          d="M 38,65 C 44,67, 50,63, 50,63 C 50,63, 56,67, 62,65 L 62,59 C 56,61, 50,57, 50,57 C 50,57, 44,61, 38,59 Z"
          fill="#ffffff"
          stroke="#4e342e"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
        <line x1="50" y1="57.5" x2="50" y2="63" stroke="#4e342e" strokeWidth="0.6" strokeDasharray="0.3 0.3" />
        
        {/* Pen Nib standing right above book */}
        <path d="M 48.2,52.5 L 51.8,52.5 L 51.5,58 L 50,61.5 L 48.5,58 Z" fill="#ffb74d" stroke="#5d4037" strokeWidth="0.5" />
        <line x1="50" y1="52.5" x2="50" y2="58" stroke="#5d4037" strokeWidth="0.5" />
        <circle cx="50" cy="55.5" r="0.4" fill="#5d4037" />

        {/* Elegant White Banner at the bottom */}
        <path 
          d="M 23,73 Q 50,81 77,73 L 75,79 Q 50,87 25,79 Z" 
          fill="#ffffff" 
          stroke="#374151" 
          strokeWidth="0.8" 
          strokeLinejoin="round" 
        />
        
        {/* Path for text to bend on the banner */}
        <path id="sman-banner-arc" d="M 23,78 Q 50,86 77,78" fill="none" />
        
        {/* Arched Banner Text: KAB. PROBOLINGGO */}
        <text className="font-sans" fontSize="4.7" fontWeight="bold" fill="#dc2626" letterSpacing="0.1">
          <textPath href="#sman-banner-arc" startOffset="50%" textAnchor="middle">
            KAB. PROBOLINGGO
          </textPath>
        </text>
      </svg>

      {showText && (
        <div className="flex flex-col select-none">
          <span
            className={`font-semibold tracking-wider text-sm leading-tight uppercase ${
              textColor === 'light' ? 'text-white' : 'text-emerald-950'
            }`}
          >
            SMAN 1 Bantaran
          </span>
          <span
            className={`text-[10px] font-medium tracking-tight uppercase ${
              textColor === 'light' ? 'text-emerald-200' : 'text-emerald-700'
            }`}
          >
            Sistem Pembinaan Karakter
          </span>
        </div>
      )}
    </div>
  );
}
