import { useLocation } from "react-router";
import {
  LoginOrRegisterBlock,
  FourOhFourBlock,
  ProfileInfoBlock,
} from "../components/blocks/Blocks";
import pages, { PageData, BlockType } from "../config/pageData";
import { useIsLoggedIn } from "../network/api";
import { BlockProps } from "../components/blocks/Block";

function GenericPage() {
  const location = useLocation();
  const path = location.pathname;
  const pageData: PageData = pages[path] || pages["404"];

  const isLoggedIn = useIsLoggedIn();

  const blocks = includeOnePrimaryContent(
    filterBlocksByLoginState(pageData.blocks, !!isLoggedIn),
  );

  console.log("blocks to render", blocks);

  return (
    <>
      {blocks.map((block, index) => {
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
        if (type === "profileInfo") {
          return <ProfileInfoBlock key={index} {...(props as BlockProps)} />;
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
