import { lazy } from "react";

// Building blocks
const LazyLoadedBuildDetailBlock = lazy(
  () => import("@/components/blocks/BuildDetailBlock/index"),
);
const LazyLoadedBuildHeroCarouselBlock = lazy(
  () => import("@/components/blocks/BuildHeroCarouselBlock/index"),
);
const LazyLoadedRelatedContentBlock = lazy(
  () => import("@/components/blocks/BuildRelatedContentBlock/index"),
);
const LazyLoadedTeaserGridBlock = lazy(
  () => import("@/components/blocks/BuildTeaserGridBlock/index"),
);
const LazyLoadedBuildCuratedListBlock = lazy(
  () => import("@/components/blocks/BuildCuratedListBlock/index"),
);
const LazyLoadedBuildContentHeaderBlock = lazy(
  () => import("@/components/blocks/BuildContentHeaderBlock/index"),
);
const LazyLoadedBuildRedirectBlock = lazy(
  () => import("@/components/blocks/BuildRedirectBlock/index"),
);

// Default blocks
const LazyLoadedGenericBlock = lazy(
  () => import("@/components/blocks/DefaultGenericBlock/index"),
);
const LazyLoadedFourOhFourBlock = lazy(
  () => import("@/components/blocks/DefaultFourOhFourBlock/index"),
);
const LazyLoadedFourOhOneBlock = lazy(
  () => import("@/components/blocks/DefaultFourOhOneBlock/index"),
);
const LazyLoadedStyleGuideBlock = lazy(
  () => import("@/components/blocks/DefaultStyleGuideBlock"),
);

// CMS Blocks
const LazyLoadedLoginRegisterBlock = lazy(
  () => import("@/components/blocks/CmsLoginOrRegisterBlock/index"),
);
const LazyLoadedProfileDashboardBlock = lazy(
  () => import("@/components/blocks/CmsProfileDashboardBlock/index"),
);
const LazyLoadedItemListBlock = lazy(
  () => import("@/components/blocks/CmsItemListBlock/index"),
);
const LazyLoadedItemCreateBlock = lazy(
  () => import("@/components/blocks/CmsItemCreateBlock/index"),
);
const LazyLoadedItemUpdateBlock = lazy(
  () => import("@/components/blocks/CmsItemUpdateBlock/index"),
);
const LazyLoadedFeedListBlock = lazy(
  () => import("@/components/blocks/CmsFeedListBlock/index"),
);
const LazyLoadedFeedCreateBlock = lazy(
  () => import("@/components/blocks/CmsFeedCreateBlock/index"),
);
const LazyLoadedFeedUpdateBlock = lazy(
  () => import("@/components/blocks/CmsFeedUpdateBlock/index"),
);

const Blocks = {
  Detail: LazyLoadedBuildDetailBlock,
  HeroCarousel: LazyLoadedBuildHeroCarouselBlock,
  RelatedContent: LazyLoadedRelatedContentBlock,
  TeaserGrid: LazyLoadedTeaserGridBlock,
  Generic: LazyLoadedGenericBlock,
  FourOhFour: LazyLoadedFourOhFourBlock,
  FourOhOne: LazyLoadedFourOhOneBlock,
  StyleGuide: LazyLoadedStyleGuideBlock,
  LoginRegister: LazyLoadedLoginRegisterBlock,
  ProfileDashboard: LazyLoadedProfileDashboardBlock,
  ItemList: LazyLoadedItemListBlock,
  ItemCreate: LazyLoadedItemCreateBlock,
  ItemUpdate: LazyLoadedItemUpdateBlock,
  FeedList: LazyLoadedFeedListBlock,
  FeedCreate: LazyLoadedFeedCreateBlock,
  FeedUpdate: LazyLoadedFeedUpdateBlock,
  CuratedList: LazyLoadedBuildCuratedListBlock,
  ContentHeader: LazyLoadedBuildContentHeaderBlock,
  Redirect: LazyLoadedBuildRedirectBlock,
};

export default Blocks;
