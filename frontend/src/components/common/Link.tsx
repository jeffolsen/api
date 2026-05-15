import { Link as RouterLink, LinkProps } from "@tanstack/react-router";
import { AnchorHTMLAttributes, forwardRef } from "react";
import clsx, { ClassValue } from "clsx";
import { Size, sizeClasses } from "./helpers/contentStyles";

const linkColors = {
  primary: "link link-primary link-hover",
  secondary: "link link-secondary link-hover",
  neutral: "link link-neutral link-hover",
  accent: "link link-accent link-hover",
  base: "link link-hover",
};

type LooseLinkProps = Omit<LinkProps, "to"> & { to?: string };

type LinkAsRouterLink = {
  as?: "Link";
  className?: ClassValue;
  size?: Size;
  linkColor?: keyof typeof linkColors;
} & LooseLinkProps;

type LinkAsAnchor = {
  as: "a";
  className?: ClassValue;
  size?: Size;
  linkColor?: keyof typeof linkColors;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

type CustomLinkProps = LinkAsRouterLink | LinkAsAnchor;

export const CustomLink = forwardRef<HTMLAnchorElement, CustomLinkProps>(
  ({ as = "Link", className, size, linkColor, ...props }, ref) => {
    const classes = clsx([
      size && sizeClasses[size],
      linkColor && linkColors[linkColor],
      className,
    ]);

    if (as === "a") {
      const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement>;
      return <a ref={ref} className={classes} {...anchorProps} />;
    }

    const linkProps = props as LooseLinkProps;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <RouterLink ref={ref} className={classes} {...(linkProps as any)} />;
  },
);

CustomLink.displayName = "CustomLink";

type InsetLinkProps =
  | Omit<LinkAsRouterLink, "children" | "className">
  | Omit<LinkAsAnchor, "children" | "className">;

export const InsetLink = forwardRef<HTMLAnchorElement, InsetLinkProps>(
  (props, ref) => {
    const classes = clsx(
      "before:content-[''] before:absolute before:inset-0 before:w-full before:h-full before:bg-transparent",
    );
    return <CustomLink ref={ref} className={classes} {...props}></CustomLink>;
  },
);

export default CustomLink;
