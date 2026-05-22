type ChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

type StaticRoute = {
  path: string;
  changefreq: ChangeFreq;
  priority: number;
};

type SitemapConfig = {
  staticRoutes: StaticRoute[];
  defaults: {
    collectionFeed: { changefreq: ChangeFreq; priority: number };
    singleItem: { changefreq: ChangeFreq; priority: number };
  };
};

// no leading or trailing slash on path to remain consistent with db
const sitemapConfig: SitemapConfig = {
  staticRoutes: [
    { path: "privacy", changefreq: "yearly", priority: 0.3 },
    { path: "terms", changefreq: "yearly", priority: 0.3 },
    { path: "cookies", changefreq: "yearly", priority: 0.3 },
    { path: "cms", changefreq: "monthly", priority: 0.7 },
  ],
  defaults: {
    collectionFeed: { changefreq: "weekly", priority: 0.8 },
    singleItem: { changefreq: "monthly", priority: 0.6 },
  },
};

export default sitemapConfig;
