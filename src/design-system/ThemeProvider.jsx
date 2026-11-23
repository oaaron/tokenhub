import { colors, spacing, typography, radii, shadows, motion } from "./tokens";
import "./styles.css";
const vars = (prefix, values) =>
  Object.fromEntries(
    Object.entries(values).map(([key, value]) => [`--${prefix}-${key}`, value]),
  );
export function ThemeProvider({
  theme = "light",
  children,
  className = "",
  ...props
}) {
  const style = {
    ...vars("ds", colors[theme] || colors.light),
    ...vars("space", spacing),
    ...vars("radius", radii),
    ...vars("shadow", shadows),
    ...vars("motion", motion),
    ...vars("font", typography.fontFamily),
    ...vars("text", typography.size),
    ...vars("weight", typography.weight),
    ...vars("leading", typography.lineHeight),
    colorScheme: theme === "dark" ? "dark" : "light",
  };
  return (
    <div
      {...props}
      className={`ds-theme ${className}`}
      data-theme={theme}
      style={style}
    >
      {children}
    </div>
  );
}
