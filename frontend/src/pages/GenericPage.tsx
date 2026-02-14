import { useLocation } from "react-router";
import { BlockProps } from "../components/blocks/Block";
import {
  LoginOrRegisterBlock,
  FourOhFourBlock,
} from "../components/blocks/Blocks";
import pages, { PageData } from "../config/pageData";

function GenericPage() {
  const location = useLocation();
  const path = location.pathname;
  const pageData: PageData = pages[path] || pages["404"];

  return (
    <>
      {pageData.blocks.map((block, index) => {
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
        return null;
      })}
    </>
  );
}

export default GenericPage;
