export const sizeClasses = {
  none: "",
  xs: "text-xs tracking-widest font-light",
  sm: "text-sm tracking-wider font-light",
  md: "text-base/80 tracking-wider font-light",
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
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  neutral: "btn-neutral",
  info: "btn-info",
  success: "btn-success",
  warning: "btn-warning",
  error: "btn-accent",
  disabled: "btn-disabled",
  ghost: "btn-ghost",
};

export type ButtonColor = keyof typeof buttonColorClasses;
