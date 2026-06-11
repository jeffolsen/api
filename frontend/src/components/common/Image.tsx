import clsx, { ClassValue } from "clsx";
import { aspectRatios, AspectRatio } from "./helpers/aspectRatioStyles";

const hoverEffects = {
  none: "",
  zoom: "transition-all duration-1000 scale-100 group-hover:scale-110",
};

export type ImageProps = {
  url: string;
  alt: string | null;
  fit?: "cover" | "contain";
  ar?: AspectRatio;
  hover?: "none" | "zoom";
  className?: ClassValue;
  mute?: boolean;
};

export default function Image({
  url,
  alt,
  fit = "cover",
  ar = "none",
  hover = "none",
  mute = false,
}: ImageProps) {
  const arStyles = aspectRatios[ar];
  const hoverStyles = hoverEffects[hover];
  if (!url) return null;
  return (
    <div className={clsx("overflow-clip relative", arStyles)}>
      <img
        src={url}
        alt={alt || ""}
        className={clsx(
          "w-full h-full absolute inset-0",
          fit === "cover" ? "object-cover" : "object-contain p-[10%]",
          mute && "saturate-0 contrast-50 opacity-75",
          hoverStyles,
        )}
      />
    </div>
  );
}
