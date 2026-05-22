import Block, { BlockComponentStandardProps } from "@/components/blocks/Block";
import usePolicyBlockData, {
  UsePolicyBlockProps,
} from "@/components/blocks/DefaultPolicyBlock/data";
import { lazy, Suspense } from "react";
import Loading from "@/components/common/Loading";

const LazyLoadedPrivacyPolicy = lazy(
  () => import("@/components/legal/PrivacyPolicy"),
);
const LazyLoadedTerms = lazy(
  () => import("@/components/legal/TermsOfService"),
);
const LazyLoadedCookies = lazy(
  () => import("@/components/legal/CookiePolicy"),
);

const policyMap = {
  PrivacyComponent: LazyLoadedPrivacyPolicy,
  TermsComponent: LazyLoadedTerms,
  CookiesComponent: LazyLoadedCookies,
};

export default function Component(config: BlockComponentStandardProps) {
  const result = usePolicyBlockData(config);

  if (result.type === "error") return null;

  const { blockProps } = result;

  return <PolicyBlock blockProps={blockProps} />;
}

function PolicyBlock({ blockProps }: { blockProps: UsePolicyBlockProps }) {
  if (!blockProps.settings.component) return null;

  const Component = policyMap[blockProps.settings.component];

  if (!Component) return null;

  return (
    <Block {...blockProps}>
      <Suspense fallback={<Loading />}>
        <Component />
      </Suspense>
    </Block>
  );
}
