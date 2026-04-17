import { Link as RouterLink, LinkProps } from "react-router";
import { AnchorHTMLAttributes, forwardRef } from "react";
import clsx, { ClassValue } from "clsx";

type LinkAsRouterLink = {
  as?: "Link";
  className?: ClassValue;
} & LinkProps;

type LinkAsAnchor = {
  as: "a";
  className?: ClassValue;
} & AnchorHTMLAttributes<HTMLAnchorElement>;

type CustomLinkProps = LinkAsRouterLink | LinkAsAnchor;

export const CustomLink = forwardRef<HTMLAnchorElement, CustomLinkProps>(
  ({ as = "Link", className, ...props }, ref) => {
    const classes = clsx(className);

    if (as === "a") {
      const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement>;
      return <a ref={ref} className={classes} {...anchorProps} />;
    }

    const linkProps = props as LinkProps;
    return <RouterLink ref={ref} className={classes} {...linkProps} />;
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
