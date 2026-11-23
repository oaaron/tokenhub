import { forwardRef } from "react";
import clsx from "clsx";
export const Card = forwardRef(function Card(
  { children, variant = "default", className, ...props },
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className={clsx("ds-card", `ds-card--${variant}`, className)}
    >
      {children}
    </div>
  );
});
export function CardHeader({ children, className, ...props }) {
  return (
    <div {...props} className={clsx("ds-card-header", className)}>
      {children}
    </div>
  );
}
export function CardFooter({ children, className, ...props }) {
  return (
    <div {...props} className={clsx("ds-card-footer", className)}>
      {children}
    </div>
  );
}
