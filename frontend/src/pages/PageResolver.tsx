import { Suspense } from "react";
import Loading from "@/components/common/Loading";
import Blocks from "@/components/blocks/Blocks";
import DocumentHead from "@/components/layout/DocumentHead";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import { PageFallback } from "./ErrorPage";
import { TFeedWithIncludes } from "@/network/feed/types";
import { TItemWithIncludes } from "@/network/item/types";

type PageResolverProps = {
  pageData: { feed: TFeedWithIncludes; item?: TItemWithIncludes };
  params: Record<string, string>;
  path: string;
};

export default function PageResolver(props: PageResolverProps) {
  const { params, path } = props;
  return (
    <ErrorBoundary fallback={(error) => PageFallback(error, params, path)}>
      <PageResolverContent {...props} />
    </ErrorBoundary>
  );
}

function PageResolverContent({ pageData, params, path }: PageResolverProps) {
  const renderedComponents = pageData.feed.components
    .map((component, index) => {
      const Block = Blocks[component.typeName as keyof typeof Blocks];
      if (Block) {
        return (
          <Block
            component={component}
            item={pageData.item}
            params={params}
            path={path}
            key={index}
          />
        );
      }
      return null;
    })
    .filter(Boolean);

  return (
    <>
      <DocumentHead {...pageData} />
      <Suspense fallback={<Loading />}>{renderedComponents}</Suspense>
    </>
  );
}
