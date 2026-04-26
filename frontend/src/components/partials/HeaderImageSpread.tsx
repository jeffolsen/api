import shuffleArray from "../../utils/shuffle";
import { useMemo } from "react";
import { TImage } from "../../network/image";
import Image from "../common/Image";
import { useGetAppImages } from "../../network/app";
import { clsx } from "clsx";

export default function HeaderImageSpread() {
  const getImages = useGetAppImages({ type: "LANDSCAPE" });
  const images = useMemo(() => {
    return shuffleArray<TImage>(getImages.data?.images || []).slice(0, 3);
  }, [getImages.data?.images]);
  return (
    <div className={clsx("flex justify-center")}>
      <div
        className={clsx([
          "w-full max-w-screen-2xl h-32 sm:h-36 flex items-stretch relative",
        ])}
      >
        {getImages.isLoading || images.length === 0 ? (
          <>
            <div className="flex-1 bg-secondary/50" />
            <div className="flex-1 bg-secondary" />
            <div className="flex-1 bg-secondary/50" />
          </>
        ) : (
          <>
            {images.map((image) => (
              <div key={image.id} className="flex-1 overflow-hidden relative">
                <Image
                  src={image.url}
                  alt={image.alt}
                  className="h-full w-full scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60" />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
