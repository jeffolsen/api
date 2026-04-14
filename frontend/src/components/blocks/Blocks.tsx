import { lazy } from "react";

// Building blocks
const LazyLoadedBuildDetailBlock = lazy(
  () => import("./BuildDetailBlock/index"),
);
const LazyLoadedBuildHeroCarouselBlock = lazy(
  () => import("./BuildHeroCarouselBlock/index"),
);
const LazyLoadedRelatedContentBlock = lazy(
  () => import("./BuildRelatedContentBlock/index"),
);
const LazyLoadedTeaserGridBlock = lazy(
  () => import("./BuildTeaserGridBlock/index"),
);
const LazyLoadedBuildCuratedListBlock = lazy(
  () => import("./BuildCuratedListBlock/index"),
);
const LazyLoadedBuildContentHeaderBlock = lazy(
  () => import("./BuildContentHeaderBlock/index"),
);
const LazyLoadedBuildRedirectBlock = lazy(
  () => import("./BuildRedirectBlock/index"),
);

// Default blocks
const LazyLoadedGenericBlock = lazy(
  () => import("./DefaultGenericBlock/index"),
);
const LazyLoadedFourOhFourBlock = lazy(
  () => import("./DefaultFourOhFourBlock/index"),
);
const LazyLoadedFourOhOneBlock = lazy(
  () => import("./DefaultFourOhOneBlock/index"),
);
const LazyLoadedStyleGuideBlock = lazy(
  () => import("./DefaultStyleGuideBlock"),
);

// CMS Blocks
const LazyLoadedLoginRegisterBlock = lazy(
  () => import("./CmsLoginOrRegisterBlock/index"),
);
const LazyLoadedProfileDashboardBlock = lazy(
  () => import("./CmsProfileDashboardBlock/index"),
);
const LazyLoadedItemListBlock = lazy(() => import("./CmsItemListBlock/index"));
const LazyLoadedItemCreateBlock = lazy(
  () => import("./CmsItemCreateBlock/index"),
);
const LazyLoadedItemUpdateBlock = lazy(
  () => import("./CmsItemUpdateBlock/index"),
);
const LazyLoadedFeedListBlock = lazy(() => import("./CmsFeedListBlock/index"));
const LazyLoadedFeedCreateBlock = lazy(
  () => import("./CmsFeedCreateBlock/index"),
);
const LazyLoadedFeedUpdateBlock = lazy(
  () => import("./CmsFeedUpdateBlock/index"),
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
