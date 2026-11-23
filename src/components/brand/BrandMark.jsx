/** Velink: an open V joined by a shared point, with outward connection rays. */
export default function BrandMark({ size = 32, className, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path
        d="M8 8H14L20 22L26 8H32L22.8 29.4C21.75 31.8 18.25 31.8 17.2 29.4L8 8Z"
        fill="currentColor"
      />
      <path
        d="M3.5 23L10.5 30.5M36.5 23L29.5 30.5"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
