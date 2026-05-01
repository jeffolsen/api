export const sizeClasses = {
  none: "",
  xs: "text-xs tracking-widest",
  sm: "text-sm tracking-wider",
  md: "text-md tracking-wider",
  lg: "text-lg md:text-xl tracking-widest",
  xl: "text-xl md:text-2xl lg:text-3xl xl:text-4xl tracking-widest",
  xxl: "text-2xl md:text-3xl lg:text-4xl xl:text-5xl tracking-wider",
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
