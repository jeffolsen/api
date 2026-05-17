import { ClientTypeName } from "@/network/clients/type";
import { TComponent } from "@/network/component/types";
import { TFeedWithIncludes } from "@/network/feed/types";
import { TImage } from "@/network/image/types";
import { TItemWithIncludes } from "@/network/item/types";
import createJsonLd from "@/utils/createJsonLd";
import getImageByPriority from "@/utils/getImageByPriority";
import { useLocation } from "@tanstack/react-router";
import { createPortal } from "react-dom";

const MAX_TITLE_LENGTH = 60;
const MAX_DESCRIPTION_LENGTH = 160;
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function DocumentHead({
  feed,
  item,
  renderFor,
}: {
  feed: TFeedWithIncludes;
  item?: TItemWithIncludes;
  renderFor?: ClientTypeName;
}) {
  const { pathname } = useLocation();

  if (renderFor === "user") {
    return (
      <>
        <meta charSet="UTF-8" />
        <meta name="robots" content="nofollow, noindex" />
      </>
    );
  }

  const hostname = new URL(BASE_URL).hostname;
  const canonical = `${hostname}${pathname}`;
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length && feed.subjectType === "SINGLE" && item) {
    segments[segments.length - 1] = item.id + "";
  }

  const path = segments.join(" ").replace(/-/g, " ").trim() || "Home";
  const capitalizedPath = path.charAt(0).toUpperCase() + path.slice(1);

  let title = `${capitalizedPath} | {s} | ${hostname}`;

  const maxSubjectLength = MAX_TITLE_LENGTH - title.length + 3;

  const mainComponent = feed.components.find(
    (comp: TComponent) => comp.propertyValues?.isPrimaryContent,
  );
  // we could see if the mainComponent has a item slug or tag its using to fetch items
  // and then grab the first item it finds with that criteria but maybe thats going too far.

  const subject = item?.name || feed?.seoTitle || mainComponent?.name || "";
  let truncatedSubject = subject;
  if (truncatedSubject.length > maxSubjectLength) {
    truncatedSubject = truncatedSubject.slice(0, maxSubjectLength - 3);
    const lastWhitespace = truncatedSubject.lastIndexOf(" ");
    if (lastWhitespace !== -1) {
      truncatedSubject = truncatedSubject.slice(0, lastWhitespace) + "...";
    }
  }

  title = title.replace("{s}", truncatedSubject);

  let description = item?.description || feed?.seoDescription || "";
  if (description.length > MAX_DESCRIPTION_LENGTH) {
    description = description.slice(0, MAX_DESCRIPTION_LENGTH - 3);
    const lastWhitespace = description.lastIndexOf(" ");
    if (lastWhitespace !== -1) {
      description = description.slice(0, lastWhitespace) + "...";
    }
  }

  const seoImage =
    getImageByPriority({
      images: item?.images.map((i) => i.image) || ([] as TImage[]),
      priority: { ICON: 3, PORTRAIT: 2, LANDSCAPE: 1 },
    })?.url ||
    feed.seoImage ||
    `${BASE_URL}/favicon-96x96.png`;

  const keywords = item?.tags.length
    ? item?.tags.map((t) => t.tag.name)
    : feed?.tags.map((t) => t.tag.name);

  // then we need to build a simple json-ld from the above info + feed.links and feed.schemaType
  const jsonLd = createJsonLd({
    title: subject,
    description,
    canonical,
    keywords,
    links: feed.links.map((fl) => fl.link.url),
    schemaType: feed.schemaType ?? undefined,
  });
  return (
    <>
      <meta charSet="UTF-8" />

      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywords?.length > 0 && (
        <meta name="keywords" content={keywords.join(", ")} />
      )}

      {canonical && <link rel="canonical" href={canonical} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="follow, index" />

      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {seoImage && <meta property="og:image" content={seoImage} />}
      <meta
        property="og:type"
        content={feed.subjectType === "COLLECTION" ? "website" : "article"}
      />
      {canonical && <meta property="og:url" content={canonical} />}

      {createPortal(
        <script id="json-ld" type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>,
        document.head,
      )}
    </>
  );
}
