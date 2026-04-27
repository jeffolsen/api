import { clsx } from "clsx";
import { InsetLink } from "@/components/common/Link";

function Logo() {
  return (
    <div
      className={clsx([
        "flex items-center relative",
        "text-xl sm:text-2xl italic md:text-3xl p-4 sm:p-6 tracking-tight font-black whitespace-nowrap uppercase",
        "text-neutral-content",
        // "text-transparent bg-clip-text bg-cover bg-center",
        // "bg-gradient-to-r from-primary to-accent via-secondary",
      ])}
      // style={{
      //   textShadow: "1px 1px 0px rgba(255, 255, 255, 0.25)",
      // }}
    >
      <span>{"<"}</span>
      <span className="mt-0.5">{`Jeff Olsen`}</span>
      <span>{" />"}</span>
      <InsetLink to="/" aria-label="home" />
    </div>
  );
}

export default Logo;
