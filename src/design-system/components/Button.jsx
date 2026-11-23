import { forwardRef } from "react";
import { LoaderCircle } from "lucide-react";
import { tv } from "tailwind-variants";
const button = tv({
  base: "ds-button",
  variants: {
    variant: {
      primary: "ds-button--primary",
      secondary: "ds-button--secondary",
      ghost: "ds-button--ghost",
      danger: "ds-button--danger",
    },
    size: { sm: "ds-button--sm", md: "ds-button--md", lg: "ds-button--lg" },
  },
  defaultVariants: { variant: "primary", size: "md" },
});
export const Button = forwardRef(function Button(
  {
    children,
    variant,
    size,
    loading = false,
    disabled,
    icon: Icon,
    className,
    type = "button",
    ...props
  },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={button({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? (
        <LoaderCircle className="ds-spinner" size={16} aria-hidden="true" />
      ) : Icon ? (
        <Icon size={16} aria-hidden="true" />
      ) : null}
      {children}
    </button>
  );
});
