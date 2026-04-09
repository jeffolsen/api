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
const LazyLoadedLoginOrRegisterBlock = lazy(
  () => import("./CmsLoginOrRegisterBlock/index"),
);
const LazyLoadedProfileActivityBlock = lazy(
  () => import("./CmsProfileDashboardBlock/index"),
);
const LazyLoadedItemsListBlock = lazy(() => import("./CmsItemListBlock/index"));
const LazyLoadedItemCreateBlock = lazy(
  () => import("./CmsItemCreateBlock/index"),
);
const LazyLoadedItemUpdateBlock = lazy(
  () => import("./CmsItemUpdateBlock/index"),
);
const LazyLoadedFeedsListBlock = lazy(() => import("./CmsFeedListBlock/index"));
const LazyLoadedFeedCreateBlock = lazy(
  () => import("./CmsFeedCreateBlock/index"),
);
const LazyLoadedFeedUpdateBlock = lazy(
  () => import("./CmsFeedUpdateBlock/index"),
);

const Blocks = {
  DetailBlock: LazyLoadedBuildDetailBlock,
  HeroCarouselBlock: LazyLoadedBuildHeroCarouselBlock,
  RelatedContentBlock: LazyLoadedRelatedContentBlock,
  TeaserGridBlock: LazyLoadedTeaserGridBlock,
  GenericBlock: LazyLoadedGenericBlock,
  FourOhFourBlock: LazyLoadedFourOhFourBlock,
  FourOhOneBlock: LazyLoadedFourOhOneBlock,
  StyleGuideBlock: LazyLoadedStyleGuideBlock,
  LoginOrRegisterBlock: LazyLoadedLoginOrRegisterBlock,
  ProfileActivityBlock: LazyLoadedProfileActivityBlock,
  ItemsListBlock: LazyLoadedItemsListBlock,
  ItemCreateBlock: LazyLoadedItemCreateBlock,
  ItemUpdateBlock: LazyLoadedItemUpdateBlock,
  FeedsListBlock: LazyLoadedFeedsListBlock,
  FeedCreateBlock: LazyLoadedFeedCreateBlock,
  FeedUpdateBlock: LazyLoadedFeedUpdateBlock,
};

export default Blocks;
