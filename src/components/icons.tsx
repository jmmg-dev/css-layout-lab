import type { ReactNode } from 'react';

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

/** Inline so the text can use the site's heading font, which an <img> SVG cannot reach. */
export const LogoMark = () => (
  <svg
    aria-hidden="true"
    width="44"
    height="44"
    viewBox="0 0 64 64"
    style={{ flex: 'none', fontFamily: 'var(--font-heading)' }}
  >
    <defs>
      <linearGradient id="logo-gradient" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#f08f63" />
        <stop offset="0.55" stopColor="#d274b4" />
        <stop offset="1" stopColor="#4f94e8" />
      </linearGradient>
    </defs>
    <rect x="1" y="1" width="62" height="62" rx="14" fill="var(--card)" stroke="var(--rule)" strokeWidth="2" />
    <text x="31" y="35" textAnchor="middle" fontSize="34" fontWeight="700" letterSpacing="-2" fill="url(#logo-gradient)">
      CL
    </text>
    <text x="32" y="54" textAnchor="middle" fontSize="18" fontWeight="600" letterSpacing="-0.5" fill="var(--ink)">
      Lab
    </text>
  </svg>
);

export const CopyIcon = () => (
  <Icon>
    <rect x="9" y="9" width="12" height="12" />
    <path d="M5 15H3V3h12v2" />
  </Icon>
);

export const CheckIcon = () => (
  <Icon>
    <path d="m5 12 5 5L20 7" />
  </Icon>
);

export const ResetIcon = () => (
  <Icon>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
  </Icon>
);

export const SearchIcon = () => (
  <Icon>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-4-4" />
  </Icon>
);

export const MenuIcon = () => (
  <Icon>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Icon>
);

export const CloseIcon = () => (
  <Icon>
    <path d="M18 6 6 18M6 6l12 12" />
  </Icon>
);

export const ArrowRightIcon = () => (
  <Icon>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);

export const ArrowLeftIcon = () => (
  <Icon>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </Icon>
);

export const LinkedInIcon = () => (
  <Icon>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
    <path d="M2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </Icon>
);

export const ProfileIcon = () => (
  <Icon>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <circle cx="12" cy="13" r="2" />
    <path d="M8 19a4 4 0 0 1 8 0" />
  </Icon>
);
