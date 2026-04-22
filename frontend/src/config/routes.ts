import { TFeed } from "../network/feed";
import { TComponent } from "../network/component";

export const cmsPaths = {
  cmsHome: "/cms",
  cmsFeedsList: "/cms/feeds",
  cmsFeedCreate: "/cms/feeds/new",
  cmsFeedUpdate: "/cms/feeds/:id",
  cmsItemsList: "/cms/items",
  cmsItemCreate: "/cms/items/new",
  cmsItemUpdate: "/cms/items/:id",
  cmsPreview: "/cms/preview",
} as const;

export const defaultPaths = {
  notFound: "/404",
  unauthorized: "/401",
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

type DefaultComponentTypeName =
  | "FourOhFour"
  | "FourOhOne"
  | "Generic"
  | "StyleGuide";

export type LocalFeedComponent = Omit<TComponent, "typeName"> & {
  typeName:
    | TComponent["typeName"]
    | CmsComponentTypeName
    | DefaultComponentTypeName;
};

export type LocalFeedWithComponents = TFeed & {
  components: LocalFeedComponent[];
};

export const fourOhFourComponent = {
  id: 8001,
  typeId: 8001,
  typeName: "FourOhFour",
  feedId: 8000,
  order: 1,
  name: "Not Found",
  propertyValues: {
    variant: "default",
    isPrimaryContent: true,
  },
  publishedAt: "2024-01-01T00:00:00Z",
  expiredAt: null,
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
} as LocalFeedComponent;

export const fourOhOneComponent = {
  id: 9001,
  typeId: 9001,
  typeName: "FourOhOne",
  feedId: 9000,
  order: 1,
  name: "Unauthorized",
  propertyValues: {
    variant: "default",
    isPrimaryContent: true,
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

const routes: LocalFeedWithComponents[] = [
  fourOhFourFeed,
  fourOhOneFeed,
  {
    id: 1000,
    path: paths.cmsHome.slice(1), // remove leading slash for matching
    subjectType: "COLLECTION",
    publishedAt: "2024-01-01T00:00:00Z",
    expiredAt: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    components: [
      {
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
      },
      {
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
      },
    ],
  },
  {
    id: 2000,
    path: paths.cmsFeedsList.slice(1), // remove leading slash for matching
    subjectType: "COLLECTION",
    publishedAt: "2024-01-01T00:00:00Z",
    expiredAt: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    components: [
      {
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
      },
    ],
  },
  {
    id: 3000,
    path: paths.cmsFeedCreate.slice(1), // remove leading slash for matching
    subjectType: "COLLECTION",
    publishedAt: "2024-01-01T00:00:00Z",
    expiredAt: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    components: [
      {
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
      },
    ],
  },
  {
    id: 4000,
    path: paths.cmsFeedUpdate.slice(1), // remove leading slash for matching
    subjectType: "SINGLE",
    publishedAt: "2024-01-01T00:00:00Z",
    expiredAt: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    components: [
      {
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
      },
    ],
  },
  {
    id: 5000,
    path: paths.cmsItemsList.slice(1), // remove leading slash for matching
    subjectType: "COLLECTION",
    publishedAt: "2024-01-01T00:00:00Z",
    expiredAt: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    components: [
      {
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
      },
    ],
  },
  {
    id: 6000,
    path: paths.cmsItemCreate.slice(1), // remove leading slash for matching
    subjectType: "COLLECTION",
    publishedAt: "2024-01-01T00:00:00Z",
    expiredAt: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    components: [
      {
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
      },
    ],
  },
  {
    id: 7000,
    path: paths.cmsItemUpdate.slice(1), // remove leading slash for matching
    subjectType: "SINGLE",
    publishedAt: "2024-01-01T00:00:00Z",
    expiredAt: null,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
    components: [
      {
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
      },
    ],
  },
];

export default routes;
