import clsx from "clsx";
import { Suspense } from "react";
import Blocks from "../blocks/Blocks";
import HeaderImageSpread from "./HeaderImageSpread";
import { useRouterState } from "@tanstack/react-router";

function HeaderHero() {
  const hero = useRouterState({
    select: (s) =>
      s.matches.find((m) => m.routeId === "/$")?.loaderData?.headerHero,
  });
  return (
    <div
      className={clsx([
        "flex flex-col bg-base-300",
        "max-h-lvh md:max-h-auto",
        hero &&
          "h-[calc(100lvh-64px)] sm:h-[calc(100lvh-82px)] md:h-[calc(100lvh-86px)] z-20 relative !max-h-[920px]", //don't like this magic number but it maintains proportion above widestWidth (1920px)
      ])}
    >
      {hero && (
        <div className="flex-grow">
          <Suspense fallback={<div className="skeleton w-full h-full" />}>
            <Blocks.HeroCarousel
              component={{ ...hero, name: "" }}
              params={{}}
              path=""
            />
          </Suspense>
        </div>
      )}
      <HeaderImageSpread />
    </div>
  );
}

export default HeaderHero;
