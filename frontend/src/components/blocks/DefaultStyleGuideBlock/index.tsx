import { lazy, Suspense } from "react";
import type { UseContentHeaderBlockProps } from "@/components/blocks/BuildContentHeaderBlock/data";
import type { UseCuratedListBlockProps } from "@/components/blocks/BuildCuratedListBlock/data";
import type { UseDetailBlockProps } from "@/components/blocks/BuildDetailBlock/data";
import type { UseHeroCarouselBlockProps } from "@/components/blocks/BuildHeroCarouselBlock/data";
import type { UseRelatedContentBlockProps } from "@/components/blocks/BuildRelatedContentBlock/data";
import type { UseTeaserGridBlockProps } from "@/components/blocks/BuildTeaserGridBlock/data";
import Loading from "@/components/common/Loading";

const TeaserGridBlock = lazy(() =>
  import("@/components/blocks/BuildTeaserGridBlock/index").then((m) => ({
    default: m.TeaserGridBlock,
  })),
);
const ContentHeaderBlock = lazy(() =>
  import("@/components/blocks/BuildContentHeaderBlock/index").then((m) => ({
    default: m.ContentHeaderBlock,
  })),
);
const CuratedListBlock = lazy(() =>
  import("@/components/blocks/BuildCuratedListBlock/index").then((m) => ({
    default: m.CuratedListBlock,
  })),
);
const HeroCarouselBlock = lazy(() =>
  import("@/components/blocks/BuildHeroCarouselBlock/index").then((m) => ({
    default: m.HeroCarouselBlock,
  })),
);
const DetailBlock = lazy(() =>
  import("@/components/blocks/BuildDetailBlock/index").then((m) => ({
    default: m.DetailBlock,
  })),
);
const RelatedContentBlock = lazy(() =>
  import("@/components/blocks/BuildRelatedContentBlock/index").then((m) => ({
    default: m.RelatedContentBlock,
  })),
);
import {
  mockItems,
  mockItemsData,
  mockItemOrder,
} from "@/components/blocks/DefaultStyleGuideBlock/mockItems";

const VARIANTS = ["alpha", "beta", "gamma"] as const;
const THEMES = ["alpha", "beta", "gamma"] as const;

type Variant = (typeof VARIANTS)[number];
type Theme = (typeof THEMES)[number];

const BASE = { isPrimaryContent: true };
const MOCK_ID = 0;

// Each block's BlockSettings narrows `width` to the variant's literal type,
// so we cast blockProps rather than trying to satisfy the intersection.
function makeProps<T>(name: string, settings: Record<string, unknown>): T {
  return { name, settings: { ...BASE, ...settings } } as unknown as T;
}

function Label({ parts }: { parts: string[] }) {
  return (
    <div className="sticky top-0 z-10 border-b border-base-300 bg-base-200 px-4 py-1 font-mono text-xs text-base-content/50">
      {parts.join(" • ")}
    </div>
  );
}

function teaserGridEntry(variant: Variant, theme: Theme) {
  return (
    <div
      key={`teasergrid-${variant}-${theme}`}
      className="w-full flex flex-col"
    >
      <Label parts={["TeaserGridBlock", variant, theme]} />
      <TeaserGridBlock
        blockProps={makeProps<UseTeaserGridBlockProps>("TeaserGrid", {
          variant,
        })}
        blockData={{ id: MOCK_ID, itemsData: mockItemsData }}
      />
    </div>
  );
}

function contentHeaderEntry(variant: Variant, theme: Theme) {
  return (
    <div
      key={`contentheader-${variant}-${theme}`}
      className="w-full flex flex-col"
    >
      <Label parts={["ContentHeaderBlock", variant, theme]} />
      <ContentHeaderBlock
        blockProps={makeProps<UseContentHeaderBlockProps>("ContentHeader", {
          variant,
          theme,
        })}
        blockData={{ id: MOCK_ID, itemsData: mockItemsData }}
      />
    </div>
  );
}

function curatedListEntry(variant: Variant, theme: Theme) {
  return (
    <div
      key={`curatedlist-${variant}-${theme}`}
      className="w-full flex flex-col"
    >
      <Label parts={["CuratedListBlock", variant, theme]} />
      <CuratedListBlock
        blockProps={makeProps<UseCuratedListBlockProps>("CuratedList", {
          variant,
          theme,
        })}
        blockData={{
          id: MOCK_ID,
          itemsData: mockItemsData,
          itemOrder: mockItemOrder,
        }}
      />
    </div>
  );
}

function heroCarouselEntry(variant: Variant, theme: Theme) {
  return (
    <div
      key={`herocarousel-${variant}-${theme}`}
      className="w-full flex flex-col"
    >
      <Label parts={["HeroCarouselBlock", variant, theme]} />
      <HeroCarouselBlock
        blockProps={makeProps<UseHeroCarouselBlockProps>("HeroCarousel", {
          variant,
          theme,
          location: "body",
        })}
        blockData={{
          id: MOCK_ID,
          itemsData: mockItemsData,
          itemOrder: mockItemOrder,
        }}
      />
    </div>
  );
}

function detailEntry(variant: Variant, theme: Theme) {
  return (
    <div key={`detail-${variant}-${theme}`} className="w-full flex flex-col">
      <Label parts={["DetailBlock", variant, theme]} />
      <DetailBlock
        blockProps={makeProps<UseDetailBlockProps>("Detail", {
          variant,
          theme,
        })}
        blockData={{ id: MOCK_ID, itemData: mockItems[0] }}
      />
    </div>
  );
}

function relatedContentEntry(variant: Variant, theme: Theme) {
  return (
    <div
      key={`relatedcontent-${variant}-${theme}`}
      className="w-full flex flex-col"
    >
      <Label parts={["RelatedContentBlock", variant, theme]} />
      <RelatedContentBlock
        blockProps={makeProps<UseRelatedContentBlockProps>("RelatedContent", {
          variant,
          theme,
        })}
        blockData={{
          id: MOCK_ID,
          itemData: mockItems[0],
          itemsData: mockItemsData,
        }}
      />
    </div>
  );
}

const blockEntries = [
  teaserGridEntry,
  contentHeaderEntry,
  curatedListEntry,
  heroCarouselEntry,
  detailEntry,
  relatedContentEntry,
];

function StyleGuideBlock() {
  return (
    <div className="divide-y divide-base-300 w-full flex flex-col">
      {blockEntries.flatMap((entry) =>
        VARIANTS.flatMap((variant) =>
          THEMES.map((theme) => (
            <Suspense key={`${entry.name}-${variant}-${theme}`} fallback={<Loading />}>
              {entry(variant, theme)}
            </Suspense>
          )),
        ),
      )}
    </div>
  );
}

export default StyleGuideBlock;
