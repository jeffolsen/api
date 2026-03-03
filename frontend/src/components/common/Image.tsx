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
  width = 200,
  height = 200,
  className,
}: ImageProps) {
  const aspectRatio = width / height;

  return (
    <img
      src={src}
      alt={alt}
      style={{
        maxWidth: `${width}px`,
        aspectRatio: aspectRatio,
      }}
      className={clsx(
        "w-full h-auto",
        fit === "cover" ? "object-cover" : "object-contain",
        className,
      )}
    />
  );
}
