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
import { LinkProps } from "react-router";
import { CustomLink } from "./Link";

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

type ButtonAsLink = {
  as: "Link";
} & LinkProps;

type ButtonAsAnchor = {
  as: "a";
} & AnchorHTMLAttributes<HTMLAnchorElement>;

type ButtonProps = ButtonBaseProps &
  (ButtonAsButton | ButtonAsSubmit | ButtonAsLink | ButtonAsAnchor);

export const Button = forwardRef<
  HTMLButtonElement | HTMLInputElement | HTMLAnchorElement,
  ButtonProps
>(({ as = "button", color, size, className, ...props }, ref) => {
  const classes = clsx(
    "btn whitespace-nowrap",
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

  if (as === "Link") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { as: _, ...linkProps } = props as ButtonAsLink;
    return (
      <CustomLink
        ref={ref as Ref<HTMLAnchorElement>}
        as="Link"
        className={classes}
        {...linkProps}
      />
    );
  }

  if (as === "a") {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { as: _, ...anchorProps } = props as ButtonAsAnchor;
    return (
      <CustomLink
        ref={ref as Ref<HTMLAnchorElement>}
        as="a"
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

export const XButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => {
    const { className, ...restProps } = props;
    const classes = clsx(
      "btn btn-circle btn-ghost border-neutral-content/20 text-base/80",
      className || "absolute right-2 top-2 btn-xs",
    );
    return (
      <Button as="button" ref={ref} className={classes} {...restProps}>
        ✕
      </Button>
    );
  },
);

export const PlusButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ ...props }, ref) => {
    const { className, ...restProps } = props;
    const classes = clsx([
      "flex items-center justify-center",
      "btn btn-ghost border-base-content/20 text-base/70",
      className,
    ]);
    return (
      <Button as="button" ref={ref} className={classes} {...restProps}>
        +
      </Button>
    );
  },
);

export const IconButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    const { className, ...restProps } = props;
    const classes = clsx("btn", "flex items-center justify-center", className);
    return (
      <Button as="button" ref={ref} className={classes} {...restProps}>
        {children}
      </Button>
    );
  },
);

Button.displayName = "Button";

export default Button;
