import { useLocation } from "react-router";
import pages, { PageData, BlockType } from "../config/pageData";
import { BlockProps } from "../components/blocks/Block";
import { useAuthState } from "../contexts/AuthContext";
import { useCallback, lazy, Suspense } from "react";
import Loading from "../components/common/Loading";

export default function GenericPage() {
  const location = useLocation();
  const path = location.pathname.replace(/^\/|\/$/g, "") || "home";
  const pageData: PageData = pages[path] || pages["404"];
  const { isAuthenticated } = useAuthState();

  const isLoggedIn = isAuthenticated();

  const calculateBlocksToRender = useCallback(
    (blocks: BlockType[]) => {
      const filteredBlocks = filterBlocksByLoginState(blocks, !!isLoggedIn);
      if (filteredBlocks.length === 0) {
        return includeOnePrimaryContent(pages["401"].blocks);
      }
      return includeOnePrimaryContent(filteredBlocks);
    },
    [isLoggedIn],
  );

  return (
    <>
      {calculateBlocksToRender(pageData.blocks)
        .filter((block) => block !== undefined)
        .map((block, index) => {
          const { type, data } = block;
          const props = { ...data, path };
          return (
            <Suspense key={index} fallback={<Loading />}>
              {type === "404" ? (
                <LazyLoadedFourOhFourBlock
                  key={index}
                  {...(props as BlockProps)}
                />
              ) : type === "401" ? (
                <LazyLoadedFourOhOneBlock
                  key={index}
                  {...(props as BlockProps)}
                />
              ) : type === "generic" ? (
                <LazyLoadedGenericBlock
                  key={index}
                  {...(props as BlockProps)}
                />
              ) : type === "login" ? (
                <LazyLoadedLoginOrRegisterBlock
                  key={index}
                  {...(props as BlockProps)}
                />
              ) : type === "profileActivity" ? (
                <LazyLoadedProfileActivityBlock
                  key={index}
                  {...(props as BlockProps)}
                />
              ) : type === "itemsList" ? (
                <LazyLoadedItemsListBlock
                  key={index}
                  {...(props as BlockProps)}
                />
              ) : type === "createItem" ? (
                <LazyLoadedCreateItemBlock
                  key={index}
                  {...(props as BlockProps)}
                />
              ) : type === "styleGuide" ? (
                <LazyLoadedStyleGuideBlock
                  key={index}
                  {...(props as BlockProps)}
                />
              ) : (
                <LazyLoadedFourOhFourBlock
                  key={index}
                  {...(props as BlockProps)}
                />
              )}
            </Suspense>
          );
        })}
    </>
  );
}

const filterBlocksByLoginState = (
  blocks: BlockType[],
  isLoggedIn: boolean,
): BlockType[] => {
  return blocks.filter((block) => {
    const showOnLoggedinState =
      block.data?.settings?.showOnLoggedinState || "BOTH";
    if (isLoggedIn && showOnLoggedinState === "LOGGED_OUT") {
      return false;
    }
    if (!isLoggedIn && showOnLoggedinState === "LOGGED_IN") {
      return false;
    }
    return true;
  });
};

const includeOnePrimaryContent = (blocks: BlockType[]): BlockType[] => {
  if (blocks.some((block) => block.data?.settings?.isprimaryContent)) {
    return blocks;
  }
  const [firstBlock, ...restBlocks] = blocks;

  return [
    {
      ...firstBlock,
      data: {
        ...(firstBlock?.data || {}),
        settings: { ...firstBlock?.data?.settings, isprimaryContent: true },
      },
    },
    ...restBlocks,
  ] as BlockType[];
};

const LazyLoadedGenericBlock = lazy(
  () => import("../components/blocks/GenericBlock"),
);
const LazyLoadedFourOhFourBlock = lazy(
  () => import("../components/blocks/FourOhFourBlock"),
);
const LazyLoadedFourOhOneBlock = lazy(
  () => import("../components/blocks/FourOhOneBlock"),
);
const LazyLoadedLoginOrRegisterBlock = lazy(
  () => import("../components/blocks/LoginOrRegisterBlock"),
);
const LazyLoadedProfileActivityBlock = lazy(
  () => import("../components/blocks/ProfileActivityBlock"),
);
const LazyLoadedItemsListBlock = lazy(
  () => import("../components/blocks/ItemsListBlock"),
);
const LazyLoadedCreateItemBlock = lazy(
  () => import("../components/blocks/CreateItemBlock"),
);
const LazyLoadedStyleGuideBlock = lazy(
  () => import("../components/blocks/StyleGuideBlock"),
);
