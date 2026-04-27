import {
  cmsPaths,
  LocalFeedWithComponents,
  LocalFeedComponent,
} from "@/config/routes";
import { TItemRelations, TItem } from "@/network/item";
import { useMemo } from "react";
// import { siteJsonLd } from "@/config/site";
// import { useHead } from "@unhead/react";

const MAX_TITLE_LENGHTH = 60;
const MAX_DESCRIPTION_LENGTH = 160;

export default function DocumentHead({
  feed,
}: {
  feed: LocalFeedWithComponents;
}) {
  // TODO: get item from id in path
  const item = undefined as TItem | undefined;
  const itemTags = undefined as TItemRelations["tagNames"] | undefined;
  const mainComponent = feed.components.find(
    (comp: LocalFeedComponent) => comp.propertyValues?.isPrimaryContent,
  );

  const isCms = Object.values(cmsPaths).find(
    (path: string) => path.slice(1) === feed.path,
  );
  const isCmsPreview =
    feed.path.startsWith(cmsPaths.cmsPreview.slice(1)) &&
    feed.path !== cmsPaths.cmsPreview.slice(1);

  const pageData = useMemo(() => {
    const data = {} as {
      canonical: string;
      title?: string;
      description?: string;
      keywords: string[];
    };

    const websiteName = ` | ${import.meta.env.VITE_WEBSITE_NAME}`;

    if (isCmsPreview) {
      data.canonical = window.location.origin + cmsPaths.cmsPreview;
      data.title = "CMS Feed Preview" + websiteName;
      data.description =
        "Page for previewing a user created feed on this site.";
    } else if (isCms || !item) {
      data.canonical = window.location.origin + window.location.pathname;
      data.title =
        mainComponent?.name?.substring(
          0,
          MAX_TITLE_LENGHTH - websiteName.length,
        ) + websiteName;
      // data.description = feed.description;
      data.keywords = Array.isArray(mainComponent?.propertyValues?.tagAllowList)
        ? mainComponent.propertyValues.tagAllowList
        : [];
    } else {
      data.canonical = window.location.origin + window.location.pathname;
      data.title =
        item.name.substring(0, MAX_TITLE_LENGHTH - websiteName.length) +
        websiteName;
      data.description = item.description?.substring(0, MAX_DESCRIPTION_LENGTH);
      data.keywords = itemTags ? itemTags : [];
    }
    return data;
  }, [item, itemTags, mainComponent, isCms, isCmsPreview]);

  // const pageSchema = useMemo(() => {
  //   return {};
  // }, [item, itemTags, mainComponent, isCms, isCmsPreview]);

  // useHead({
  //   script: [
  //     {
  //       type: "application/ld+json",
  //       textContent: JSON.stringify(pageSchema),
  //       // Use key to avoid duplicates if re-rendered
  //       key: "starter-ld-json",
  //     },
  //   ],
  // });

  return (
    <>
      <meta charSet="UTF-8" />
      {pageData.title && <title>{pageData.title}</title>}
      {pageData.description && (
        <meta name="description" content={pageData.description} />
      )}

      {pageData.canonical && <link rel="canonical" href={pageData.canonical} />}

      <meta name="viewport" content="width=device-width, initial-scale=1" />
      {isCmsPreview ? (
        <meta name="robots" content="nofollow, noindex" />
      ) : (
        <meta name="robots" content="follow, index" />
      )}

      {pageData.keywords?.length > 0 && (
        <meta name="keywords" content={pageData.keywords.join(", ")} />
      )}
    </>
  );
}
