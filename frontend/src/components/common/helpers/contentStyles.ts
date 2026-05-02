export const sizeClasses = {
  none: "",
  xs: "text-xs tracking-widest",
  sm: "text-sm tracking-wider",
  md: "text-md tracking-wider",
  lg: "text-lg tracking-widest",
  xl: "text-xl tracking-widest",
  xxl: "text-2xl md:text-3xl lg:text-4xl tracking-wider",
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
  disabled: "btn-disabled",
  ghost: "btn-ghost",
};

export type ButtonColor = keyof typeof buttonColorClasses;
