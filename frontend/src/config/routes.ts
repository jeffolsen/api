import { TFeedLink, TFeedTag, TFeedWithIncludes } from "@/network/feed/types";
import { TComponent } from "@/network/component/types";

export const cmsPaths = {
  cmsHome: "/cms",
  cmsFeedsList: "/cms/feeds",
  cmsFeedCreate: "/cms/feeds/new",
  cmsFeedUpdate: "/cms/feeds/$id",
  cmsItemsList: "/cms/items",
  cmsItemCreate: "/cms/items/new",
  cmsItemUpdate: "/cms/items/$id",
  cmsPreview: "/cms/feeds/preview",
} as const;

export const defaultPaths = {
  notFound: "/404",
  unauthorized: "/401",
  underConstruction: "/204",
  privacy: "/privacy",
} as const;

export const paths = {
  ...defaultPaths,
  ...cmsPaths,
} as const;

// Feeds for local pages
export const genericTemplate = {
  id: 1000,
  subjectType: "COLLECTION",
  publishedAt: null,
  path: "",
  seoTitle: "",
  seoDescription: "",
  seoImage: null,
  schemaType: "WebPage",
  expiredAt: null,
  createdAt: "",
  updatedAt: "",
  components: [] as TComponent[],
  links: [] as TFeedLink[],
  tags: [] as TFeedTag[],
} as TFeedWithIncludes;

export const cmsTemplate = {
  ...genericTemplate,
  schemaType: "CreativeWork",
  components: [] as TComponent[],
  links: [] as TFeedLink[],
  tags: [
    { tagId: 1000, feedId: 1000, tag: { id: 1000, name: "NODE" } },
    { tagId: 1000, feedId: 1000, tag: { id: 1000, name: "EXPRESS" } },
    {
      tagId: 1000,
      feedId: 1000,
      tag: { id: 1000, name: "TYPESCRIPT" },
    },
    { tagId: 1000, feedId: 1000, tag: { id: 1000, name: "TAILWIND" } },
  ],
} as TFeedWithIncludes;

export const policyTemplate = {
  ...genericTemplate,
};

// components for local components
export const genericComponent = {
  id: 10001,
  typeId: 10001,
  typeName: "Generic" as TComponent["typeName"],
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
} as TComponent;

// Error components
const genericStatusComponent = {
  ...genericComponent,
  typeName: "Error" as TComponent["typeName"],
} as TComponent;

export const twoOhFourComponent = {
  ...genericStatusComponent,
  name: "Under Construction",
  propertyValues: {
    ...genericStatusComponent.propertyValues,
    errorCode: 204,
  },
} as TComponent;

export const fourOhFourComponent = {
  ...genericStatusComponent,
  name: "Not Found",
  propertyValues: {
    ...genericStatusComponent.propertyValues,
    errorCode: 404,
  },
} as TComponent;

export const fourOhOneComponent = {
  ...genericStatusComponent,
  name: "Unauthorized",
  propertyValues: {
    ...genericStatusComponent.propertyValues,
    errorCode: 401,
  },
} as TComponent;

export const fourTwentyNineComponent = {
  ...genericStatusComponent,
  name: "Slow Down",
  propertyValues: {
    ...genericStatusComponent.propertyValues,
    errorCode: 429,
  },
} as TComponent;

// Policy components
const genericPolicyComponent = {
  ...genericComponent,
  typeName: "Policy" as TComponent["typeName"],
} as TComponent;

export const privacyComponent = {
  ...genericPolicyComponent,
  name: "Privacy Policy",
  propertyValues: {
    ...genericPolicyComponent.propertyValues,
    variant: "privacy",
  },
} as TComponent;

export const termsComponent = {
  ...genericPolicyComponent,
  name: "Terms of Service",
  propertyValues: {
    ...genericPolicyComponent.propertyValues,
    variant: "terms",
  },
} as TComponent;

export const cookiesComponent = {
  ...genericPolicyComponent,
  name: "Cookie Policy",
  propertyValues: {
    ...genericPolicyComponent.propertyValues,
    variant: "cookies",
  },
} as TComponent;

// CMS components
const genericCmsComponent = {
  ...genericPolicyComponent,
};
export const loginOrRegisterComponent = {
  ...genericCmsComponent,
  typeName: "LoginRegister" as TComponent["typeName"],
  name: "CMS Portal",
} as TComponent;

export const profileDashBoardComponent = {
  ...genericCmsComponent,
  typeName: "ProfileDashboard" as TComponent["typeName"],
  name: "CMS Dashboard",
} as TComponent;

export const feedListComponent = {
  ...genericCmsComponent,
  typeName: "FeedList" as TComponent["typeName"],
  name: "Feed List",
} as TComponent;

export const feedCreateComponent = {
  ...genericCmsComponent,
  typeName: "FeedCreate" as TComponent["typeName"],
  name: "Feed Create",
} as TComponent;

export const feedUpdateComponent = {
  ...genericCmsComponent,
  typeName: "FeedUpdate" as TComponent["typeName"],
  name: "Feed Update",
} as TComponent;

export const itemListComponent = {
  ...genericCmsComponent,
  typeName: "ItemList" as TComponent["typeName"],
  name: "Item List",
} as TComponent;

export const itemCreateComponent = {
  ...genericCmsComponent,
  typeName: "ItemCreate" as TComponent["typeName"],
  name: "Item Create",
} as TComponent;

export const itemUpdateComponent = {
  ...genericCmsComponent,
  typeName: "ItemUpdate" as TComponent["typeName"],
  name: "Item Update",
} as TComponent;
