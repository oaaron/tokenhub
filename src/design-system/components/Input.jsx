import { forwardRef, useId } from "react";
import clsx from "clsx";
export const Input = forwardRef(function Input(
  {
    label,
    hint,
    error,
    id,
    icon: Icon,
    trailing,
    className,
    disabled,
    "aria-describedby": describedBy,
    ...props
  },
  ref,
) {
  const generated = useId();
  const inputId = id || generated;
  const description =
    [hint && `${inputId}-hint`, error && `${inputId}-error`, describedBy]
      .filter(Boolean)
      .join(" ") || undefined;
  return (
    <div className={clsx("ds-field", className)}>
      {label && (
        <label className="ds-label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div
        className={clsx(
          "ds-input-wrap",
          error && "is-invalid",
          disabled && "is-disabled",
        )}
      >
        {Icon && (
          <Icon size={16} className="ds-input-icon" aria-hidden="true" />
        )}
        <input
          {...props}
          ref={ref}
          id={inputId}
          disabled={disabled}
          className="ds-input"
          aria-invalid={error ? true : undefined}
          aria-describedby={description}
        />
        {trailing && <span className="ds-input-trailing">{trailing}</span>}
      </div>
      {hint && (
        <p className="ds-hint" id={`${inputId}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="ds-error" id={`${inputId}-error`}>
          {error}
        </p>
      )}
    </div>
  );
});
