import { TFeed } from "@/network/feed/types";
import { TComponent } from "@/network/component/types";

export const cmsPaths = {
  cmsHome: "/cms",
  cmsFeedsList: "/cms/feeds",
  cmsFeedCreate: "/cms/feeds/new",
  cmsFeedUpdate: "/cms/feeds/$id",
  cmsItemsList: "/cms/items",
  cmsItemCreate: "/cms/items/new",
  cmsItemUpdate: "/cms/items/$id",
  cmsPreview: "/cms/preview",
} as const;

export const defaultPaths = {
  notFound: "/404",
  unauthorized: "/401",
  underConstruction: "/204",
  privacy: "/privacy",
  // contact: "/contact",
  // styleGuide: "/style-guide",
  // siteMap: "/sitemap",
} as const;

export const paths = {
  ...defaultPaths,
  ...cmsPaths,
} as const;

type CmsComponentTypeName =
  | "FeedList"
  | "FeedCreate"
  | "FeedUpdate"
  | "ItemList"
  | "ItemCreate"
  | "ItemUpdate"
  | "LoginRegister"
  | "ProfileDashboard";

type DefaultComponentTypeName = "Error" | "Generic" | "Policy" | "StyleGuide";

export type LocalFeedComponent = Omit<TComponent, "typeName"> & {
  typeName:
    | TComponent["typeName"]
    | CmsComponentTypeName
    | DefaultComponentTypeName;
};

export type LocalFeedWithComponents = TFeed & {
  components: LocalFeedComponent[];
};

export const twoOhFourComponent = {
  id: 7001,
  typeId: 7001,
  typeName: "Error",
  feedId: 7000,
  order: 1,
  name: "Under Construction",
  propertyValues: {
    variant: "default",
    isPrimaryContent: true,
    errorCode: 204,
  },
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
} as LocalFeedComponent;

export const twoOhFourFeed = {
  id: 7000,
  path: paths.underConstruction.slice(1),
  subjectType: "COLLECTION",
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  components: [twoOhFourComponent],
} as LocalFeedWithComponents;

export const fourOhFourComponent = {
  id: 8001,
  typeId: 8001,
  typeName: "Error",
  feedId: 8000,
  order: 1,
  name: "Not Found",
  propertyValues: {
    variant: "default",
    isPrimaryContent: true,
    errorCode: 404,
  },
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
} as LocalFeedComponent;

export const fourOhOneComponent = {
  id: 9001,
  typeId: 9001,
  typeName: "Error",
  feedId: 9000,
  order: 1,
  name: "Unauthorized",
  propertyValues: {
    variant: "default",
    isPrimaryContent: true,
    errorCode: 401,
  },
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
} as LocalFeedComponent;

export const fourTwentyNineComponent = {
  id: 9001,
  typeId: 9001,
  typeName: "Error",
  feedId: 9000,
  order: 1,
  name: "Slow Down",
  propertyValues: {
    variant: "default",
    isPrimaryContent: true,
    errorCode: 429,
  },
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
} as LocalFeedComponent;

export const genericComponent = {
  id: 10001,
  typeId: 10001,
  typeName: "Generic",
  feedId: 0,
  order: 1,
  name: "Generic Component",
  propertyValues: {
    variant: "default",
    isPrimaryContent: true,
  },
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
} as LocalFeedComponent;

export const privacyComponent = {
  id: 10001,
  typeId: 10001,
  typeName: "Policy",
  feedId: 10000,
  order: 1,
  name: "Privacy Policy",
  propertyValues: {
    variant: "privacy",
    isPrimaryContent: true,
  },
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
} as LocalFeedComponent;

export const fourOhFourFeed = {
  id: 8000,
  path: paths.notFound.slice(1), // remove leading slash for matching
  subjectType: "COLLECTION",
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  components: [fourOhFourComponent],
} as LocalFeedWithComponents;

export const fourOhOneFeed = {
  id: 9000,
  path: paths.unauthorized.slice(1), // remove leading slash for matching
  subjectType: "COLLECTION",
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  components: [fourOhOneComponent],
} as LocalFeedWithComponents;

export const fourTwentyNineFeed = {
  id: 9000,
  path: paths.unauthorized.slice(1), // remove leading slash for matching
  subjectType: "COLLECTION",
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  components: [fourTwentyNineComponent],
} as LocalFeedWithComponents;

export const privacyFeed = {
  id: 10000,
  path: paths.privacy.slice(1), // remove leading slash for matching
  subjectType: "COLLECTION",
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  components: [privacyComponent],
} as LocalFeedWithComponents;

export const loginOrRegisterComponent = {
  id: 1001,
  typeId: 1001,
  typeName: "LoginRegister",
  feedId: 1000,
  order: 1,
  name: "Login or Register",
  propertyValues: {
    variant: "default",
    isPrimaryContent: true,
    hideFor: "authenticated",
  },
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
} as LocalFeedComponent;

export const profileDashBoardComponent = {
  id: 1002,
  typeId: 1002,
  typeName: "ProfileDashboard",
  feedId: 1000,
  order: 2,
  name: "Profile Dashboard",
  propertyValues: {
    variant: "default",
    isPrimaryContent: true,
    hideFor: "unauthenticated",
  },
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
} as LocalFeedComponent;

export const cmsIngressFeed = {
  id: 1000,
  path: paths.cmsHome.slice(1), // remove leading slash for matching
  subjectType: "COLLECTION",
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  components: [loginOrRegisterComponent, profileDashBoardComponent],
} as LocalFeedWithComponents;

export const feedListComponent = {
  id: 2001,
  typeId: 2001,
  typeName: "FeedList",
  feedId: 2000,
  order: 1,
  name: "Feed List",
  propertyValues: {
    variant: "default",
    isPrimaryContent: true,
  },
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
} as LocalFeedComponent;

export const feedCreateComponent = {
  id: 3001,
  typeId: 3001,
  typeName: "FeedCreate",
  feedId: 3000,
  order: 1,
  name: "Feed Create",
  propertyValues: {
    variant: "default",
    isPrimaryContent: true,
  },
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
} as LocalFeedComponent;

export const feedUpdateComponent = {
  id: 4001,
  typeId: 4001,
  typeName: "FeedUpdate",
  feedId: 4000,
  order: 1,
  name: "Feed Update",
  propertyValues: {
    variant: "default",
    isPrimaryContent: true,
  },
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
} as LocalFeedComponent;

export const itemListComponent = {
  id: 5001,
  typeId: 5001,
  typeName: "ItemList",
  feedId: 5000,
  order: 1,
  name: "Item List",
  propertyValues: {
    variant: "default",
    isPrimaryContent: true,
  },
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
} as LocalFeedComponent;

export const itemCreateComponent = {
  id: 6001,
  typeId: 6001,
  typeName: "ItemCreate",
  feedId: 6000,
  order: 1,
  name: "Item Create",
  propertyValues: {
    variant: "default",
    isPrimaryContent: true,
  },
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
} as LocalFeedComponent;

export const itemUpdateComponent = {
  id: 7001,
  typeId: 7001,
  typeName: "ItemUpdate",
  feedId: 7000,
  order: 1,
  name: "Item Update",
  propertyValues: {
    variant: "default",
    isPrimaryContent: true,
  },
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
} as LocalFeedComponent;

const routes: LocalFeedWithComponents[] = [
  fourOhFourFeed,
  fourOhOneFeed,
  privacyFeed,
  cmsIngressFeed,
  {
    id: 2000,
    path: paths.cmsFeedsList.slice(1), // remove leading slash for matching
    subjectType: "COLLECTION",
    publishedAt: "2024-01-01T00:00:00Z",
    expiredAt: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    components: [feedListComponent],
  },
  {
    id: 3000,
    path: paths.cmsFeedCreate.slice(1), // remove leading slash for matching
    subjectType: "COLLECTION",
    publishedAt: "2024-01-01T00:00:00Z",
    expiredAt: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    components: [feedCreateComponent],
  },
  {
    id: 4000,
    path: paths.cmsFeedUpdate.slice(1), // remove leading slash for matching
    subjectType: "SINGLE",
    publishedAt: "2024-01-01T00:00:00Z",
    expiredAt: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    components: [feedUpdateComponent],
  },
  {
    id: 5000,
    path: paths.cmsItemsList.slice(1), // remove leading slash for matching
    subjectType: "COLLECTION",
    publishedAt: "2024-01-01T00:00:00Z",
    expiredAt: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    components: [itemListComponent],
  },
  {
    id: 6000,
    path: paths.cmsItemCreate.slice(1), // remove leading slash for matching
    subjectType: "COLLECTION",
    publishedAt: "2024-01-01T00:00:00Z",
    expiredAt: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    components: [itemCreateComponent],
  },
  {
    id: 7000,
    path: paths.cmsItemUpdate.slice(1), // remove leading slash for matching
    subjectType: "SINGLE",
    publishedAt: "2024-01-01T00:00:00Z",
    expiredAt: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    components: [itemUpdateComponent],
  },
];

export default routes;
