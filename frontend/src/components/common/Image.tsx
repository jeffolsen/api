import clsx, { ClassValue } from "clsx";
import { aspectRatios, AspectRatio } from "./helpers/aspectRatioStyles";

const hoverEffects = {
  none: "",
  zoom: "transition-all duration-1000 scale-100 group-hover:scale-110",
};

export type ImageProps = {
  url: string;
  alt: string;
  fit?: "cover" | "contain";
  ar?: AspectRatio;
  hover?: "none" | "zoom";
  className?: ClassValue;
};

export default function Image({
  url,
  alt,
  fit = "cover",
  ar = "natural",
  hover = "none",
  className,
}: ImageProps) {
  const arStyles = aspectRatios[ar];
  const hoverStyles = hoverEffects[hover];
  if (!url) return null;
  return (
    <div className={clsx("overflow-clip", arStyles, className)}>
      <img
        src={url}
        alt={alt}
        className={clsx(
          "w-full h-full",
          hoverStyles,
          fit === "cover" ? "object-cover" : "object-contain",
        )}
      />
    </div>
  );
}
