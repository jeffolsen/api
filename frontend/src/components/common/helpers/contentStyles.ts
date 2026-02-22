export const sizeClasses = {
  none: "",
  xs: "text-xs tracking-widest font-light",
  sm: "text-sm tracking-wider font-light",
  md: "text-base tracking-wider font-light",
  lg: "text-lg md:text-xl tracking-widest font-medium",
  xl: "text-xl md:text-2xl lg:text-3xl xl:text-4xl tracking-widest font-semibold",
  xxl: "text-2xl md:text-3xl lg:text-4xl xl:text-5xl tracking-wider font-semibold",
};

export type Size = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export const buttonSizeClasses = {
  none: "",
  xs: "btn-xs",
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

export type ButtonSize = "none" | "xs" | "sm" | "md" | "lg";

export const buttonColorClasses = {
  none: "",
  primary: "bg-primary text-primary-content",
  secondary: "bg-secondary text-secondary-content",
  accent: "bg-accent text-accent-content",
  neutral: "bg-neutral text-neutral-content",
  info: "bg-info text-info-content",
  success: "bg-success text-success-content",
  warning: "bg-warning text-warning-content",
  error: "bg-error text-error-content",
};

export type ButtonColor =
  | "none"
  | "primary"
  | "secondary"
  | "accent"
  | "neutral"
  | "info"
  | "success"
  | "warning"
  | "error";
