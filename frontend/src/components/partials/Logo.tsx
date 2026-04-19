import { clsx } from "clsx";
import { InsetLink } from "../common/Link";

function Logo() {
  return (
    <div
      className={clsx([
        "flex items-center relative",
        "text-2xl md:text-3xl p-6 tracking-tight font-black whitespace-nowrap uppercase",
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
