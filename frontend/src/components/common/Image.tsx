import clsx, { ClassValue } from "clsx";

export type ImageProps = {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  positionX?: "left" | "center" | "right";
  positionY?: "top" | "center" | "bottom";
  width?: number;
  height?: number;
  className?: ClassValue;
};

export default function Image({
  src,
  alt,
  fit = "cover",
  className,
}: ImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={clsx(
        "w-full h-auto",
        fit === "cover" ? "object-cover" : "object-contain",
        className,
      )}
    />
  );
}
