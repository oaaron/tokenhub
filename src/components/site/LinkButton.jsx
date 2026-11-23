import { Link } from "react-router-dom";
import clsx from "clsx";
export function LinkButton({
  to,
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) {
  const classes = clsx(
    "ds-button",
    `ds-button--${variant}`,
    `ds-button--${size}`,
    className,
  );
  return /^https?:/.test(to) ? (
    <a {...props} href={to} className={classes}>
      {children}
    </a>
  ) : (
    <Link {...props} to={to} className={classes}>
      {children}
    </Link>
  );
}
