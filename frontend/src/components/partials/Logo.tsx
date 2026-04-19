import { clsx } from "clsx";
import { InsetLink } from "../common/Link";

function Logo() {
  return (
    <div
      className={clsx([
        "flex items-center relative",
        "text-xl sm:text-2xl italic md:text-3xl p-4 sm:p-6 tracking-tight font-black whitespace-nowrap uppercase",
      ])}
    >
      <span>{"<"}</span>
      <span className="mt-0.5">{`Jeff Olsen`}</span>
      <span>{" />"}</span>
      <InsetLink to="/" aria-label="home" />
    </div>
  );
}

export default Logo;
