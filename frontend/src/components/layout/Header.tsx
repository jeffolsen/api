import { HeadingLevelProvider } from "../common/Heading";
import Button from "../common/Button";
import { useGetAppImages } from "../../network/app";
import Image from "../common/Image";
import shuffleArray from "../../utils/shuffle";
import { useMemo } from "react";
import { TImage } from "../../network/image";
import { TComponent } from "../../network/component";
import BreadCrumbs from "./BreadCrumbs";
import { useLoaderData } from "react-router";
import { Suspense } from "react";
import Blocks from "../blocks/Blocks";
import ThemeToggle from "../partials/ThemeToggle";

function Header() {
  const getImages = useGetAppImages({ type: "LANDSCAPE" });
  const images = useMemo(() => {
    return shuffleArray<TImage>(getImages.data?.images || []).slice(0, 3);
  }, [getImages.data?.images]);
  const data = useLoaderData();
  const hero = data.pageLayout.components.find(
    (c: TComponent) =>
      c.typeName === "HeroCarousel" && c.propertyValues.location === "header",
  );

  return (
    <HeadingLevelProvider>
      <header className="flex justify-center top-0 sticky bg-base-200 z-10">
        <div className="flex items-center justify-between w-full max-w-screen-2xl">
          <ul className="navbar">
            <li>
              <Button to="/" as="Link" color="ghost" size="lg">
                Home
              </Button>
            </li>
            <li>
              <Button to="/about" as="Link" color="ghost" size="lg">
                About
              </Button>
            </li>
            <li>
              <Button to="/cms" as="Link" color="ghost" size="lg">
                CMS
              </Button>
            </li>
            <li>
              <Button to="/cv" as="Link" color="ghost" size="lg">
                CV
              </Button>
            </li>
          </ul>
          <ThemeToggle />
        </div>
      </header>
      {hero && (
        <Suspense fallback={null}>
          <Blocks.HeroCarousel component={hero} params={{}} path="" />
        </Suspense>
      )}
      <div className="flex justify-center">
        <div className="w-full max-w-screen-2xl h-32 sm:h-36 flex items-stretch relative gradient-to-b from-base-100 to-transparent">
          {getImages.isLoading || images.length === 0 ? (
            <>
              <div className="flex-1 bg-secondary/50" />
              <div className="flex-1 bg-secondary" />
              <div className="flex-1 bg-secondary/50" />
            </>
          ) : (
            <>
              {images.map((image) => (
                <div key={image.id} className="flex-1 overflow-hidden">
                  <Image
                    src={image.url}
                    alt={image.alt}
                    width={600}
                    height={180}
                    className="min-h-[calc(100%+theme(spacing.8))] min-w-[calc(100%+theme(spacing.8))] -mt-2 -ml-2"
                  />
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      <BreadCrumbs />
    </HeadingLevelProvider>
  );
}

export default Header;
