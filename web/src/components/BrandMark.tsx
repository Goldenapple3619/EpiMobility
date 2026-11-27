import { brand } from '@/app/brand'

export function BrandMark() {
  return (
    <span className="brand-mark">
      <svg
        aria-hidden="true"
        focusable="false"
        className="brand-mark__symbol"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="48" rx="14" fill="#0B5E5C" />
        <circle cx="24" cy="24" r="15" fill="none" stroke="#D3A76D" strokeWidth="1.5" />
        <path d="M24 7.8 30.1 24 24 19.8 17.9 24Z" fill="#FFFFFF" />
        <path d="M17.9 24 24 28.2 30.1 24 24 40.2Z" fill="#D3A76D" />
        <circle cx="24" cy="24" r="2.3" fill="#FFFFFF" />
      </svg>
      <span className="brand-mark__wordmark">
        <strong>{brand.shortName}</strong>
        <span>{brand.descriptor}</span>
      </span>
    </span>
  )
}
