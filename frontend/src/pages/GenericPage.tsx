import { useLocation } from "react-router";
import {
  LoginOrRegisterBlock,
  FourOhFourBlock,
  ProfileActivityBlock,
} from "../components/blocks/Blocks";
import pages, { PageData, BlockType } from "../config/pageData";
import { BlockProps } from "../components/blocks/Block";
import { useAuthState } from "../contexts/AuthContext";
import { useEffect, useState } from "react";

function GenericPage() {
  const location = useLocation();
  const path = location.pathname;
  const pageData: PageData = pages[path] || pages["404"];
  const { isAuthenticated } = useAuthState();

  const isLoggedIn = isAuthenticated();
  const [blocks, setBlocks] = useState<BlockType[]>(
    includeOnePrimaryContent(
      filterBlocksByLoginState(pageData.blocks, !!isLoggedIn),
    ),
  );

  useEffect(() => {
    const filteredBlocks = filterBlocksByLoginState(
      pageData.blocks,
      !!isLoggedIn,
    );
    const blocksWithPrimaryContent = includeOnePrimaryContent(filteredBlocks);
    setBlocks(blocksWithPrimaryContent);
  }, [pageData.blocks, isLoggedIn]);

  console.log("isLoggedIn", isLoggedIn);
  console.log("blocks to render", blocks);

  return (
    <>
      {blocks.length &&
        blocks.map((block, index) => {
          const { type, data } = block;
          const props = { ...data, path };
          if (type === "404") {
            return <FourOhFourBlock key={index} {...(props as BlockProps)} />;
          }
          if (type === "login") {
            return (
              <LoginOrRegisterBlock key={index} {...(props as BlockProps)} />
            );
          }
          if (type === "profileActivity") {
            return (
              <ProfileActivityBlock key={index} {...(props as BlockProps)} />
            );
          }
          return null;
        })}
    </>
  );
}

export default GenericPage;

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
