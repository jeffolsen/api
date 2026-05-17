import { TFeedSchemaType, TSubjectType } from "@/network/feed/types";

type JsonLdIngredients = {
  title?: string;
  description?: string;
  canonical?: string;
  path?: string;
  keywords?: string[];
  links?: string[];
  schemaType?: TFeedSchemaType;
  subjectType?: TSubjectType;
};

const createJsonLd = (props: JsonLdIngredients) => {
  const { title, description, canonical, keywords, links, schemaType } = props;

  const base = {
    "@context": "https://schema.org",
    "@type": schemaType ?? "WebPage",
    name: title,
    url: canonical,
    ...(description && { description }),
    ...(keywords?.length && { keywords: keywords.join(", ") }),
  };

  if (schemaType === "Person") {
    return { ...base, sameAs: links ?? [] };
  }
  if (schemaType === "Article" || schemaType === "CreativeWork") {
    return { ...base };
  }

  return base;
};

export default createJsonLd;
