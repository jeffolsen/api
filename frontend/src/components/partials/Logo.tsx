import { clsx } from "clsx";
import { InsetLink } from "../common/Link";

function Logo() {
  return (
    <div
      className={clsx([
        "flex items-center relative",
        "text-xl sm:text-2xl md:text-3xl tracking-tight font-black whitespace-nowrap uppercase",
      ])}
    >
      <span>{"<"}</span>
      <span className="mt-0.5">{`Jeff Olsen`}</span>
      <span>{" />"}</span>
      <InsetLink to="/" />
    </div>
  );
}

export default Logo;
