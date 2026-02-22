import {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  AnchorHTMLAttributes,
  forwardRef,
  Ref,
} from "react";
import {
  ButtonColor,
  buttonColorClasses,
  buttonSizeClasses,
  ButtonSize,
} from "./helpers/contentStyles";
import clsx, { ClassValue } from "clsx";

type ButtonBaseProps = {
  color?: ButtonColor;
  size?: ButtonSize;
  className?: ClassValue;
};

type ButtonAsButton = {
  as?: "button";
  type?: "button" | "submit" | "reset";
} & ButtonHTMLAttributes<HTMLButtonElement>;

type ButtonAsSubmit = {
  as: "submit";
  type?: never;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

type ButtonAsAnchor = {
  as: "a";
  href: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

type ButtonProps = ButtonBaseProps &
  (ButtonAsButton | ButtonAsSubmit | ButtonAsAnchor);

export const Button = forwardRef<
  HTMLButtonElement | HTMLInputElement | HTMLAnchorElement,
  ButtonProps
>(({ as = "button", color, size, className, ...props }, ref) => {
  const classes = clsx(
    "btn btn-block flex-1 whitespace-nowrap",
    buttonSizeClasses[size || "none"],
    buttonColorClasses[color || "none"],
    className,
  );
  if (as === "submit") {
    const { children, value, ...inputProps } = props as ButtonAsSubmit;

    return (
      <input
        ref={ref as Ref<HTMLInputElement>}
        type="submit"
        value={value || (typeof children === "string" ? children : undefined)}
        className={classes}
        {...inputProps}
      />
    );
  }

  if (as === "a") {
    const { href, ...anchorProps } = props as ButtonAsAnchor;
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        href={href}
        className={classes}
        {...anchorProps}
      />
    );
  }

  const { type = "button", ...buttonProps } = props as ButtonAsButton;
  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type={type}
      className={classes}
      {...buttonProps}
    />
  );
});

Button.displayName = "Button";
