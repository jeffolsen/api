import { TImage } from "@/network/image/types";
import Image, { ImageProps } from "../common/Image";
import ScrollInFade from "../common/ScrollInFade";
import {
  aspectRatios,
  AspectRatio,
} from "@/components/common/helpers/aspectRatioStyles";
import clsx from "clsx";
import Heading from "../common/Heading";
import { InsetLink } from "../common/Link";

type ImageCardProps = {
  image: TImage | null;
  label: string;
  link: string | null;
  ar?: AspectRatio;
};

export default function ImageCard({
  image,
  label,
  link,
  ar = "none",
}: ImageCardProps) {
  const img = {
    ...image,
    ar: "none",
    hover: "zoom",
    fit: image?.type === "ICON" ? "contain" : "cover",
  } as ImageProps;
  const arCss = aspectRatios[ar];
  return (
    <ScrollInFade
      className={clsx(["bg-base-100 border-none shadow-xl", "group", arCss])}
    >
      <Image
        {...img}
        className={clsx([
          "absolute",
          img.fit === "contain" ? "p-6" : "opacity-50",
        ])}
      />
      {img.fit !== "contain" && (
        <div
          className={clsx([
            "absolute inset-0 flex justify-center items-center p-3",
            img.url ? "bg-gradient-to-t from-transparent via-black/80" : "",
          ])}
        >
          <Heading
            headingSize="xs"
            headingStyles={clsx([
              "line-clamp-2 text-center uppercase",
              "transition-all duration-1000 scale-100 group-hover:scale-110",
              img.url
                ? "drop-shadow-lg shadow-black text-primary-content"
                : "text-base-content",
            ])}
          >
            {label}
          </Heading>
        </div>
      )}
      {link && <InsetLink to={link} aria-label={label} />}
    </ScrollInFade>
  );
}
