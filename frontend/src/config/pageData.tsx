import { BlockProps } from "../components/blocks/Block";

export type BlockType = {
  type: string;
  data?: BlockProps;
};

export type PageData = {
  blocks: BlockType[];
};

export type PagesDictionary = Record<string, PageData>;

const pages = {
  "/": {
    blocks: [
      {
        type: "login",
        data: {
          title: "Login or Register",
          settings: {
            isprimaryContent: true,
            showOnLoggedinState: "LOGGED_OUT",
            width: "sm",
          },
        },
      },
      {
        type: "profileActivity",
        data: {
          title: "Your Profile",
          settings: {
            // isprimaryContent: true,
            showOnLoggedinState: "LOGGED_IN",
            width: "lg",
          },
        },
      },
    ],
  },
  "404": {
    blocks: [
      {
        type: "404",
        data: {
          title: "Page Not Found",
          settings: {
            isprimaryContent: true,
            showOnLoggedinState: "BOTH",
            width: "sm",
          },
        },
      },
    ],
  },
} as PagesDictionary;

export default pages;
