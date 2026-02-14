import { BlockProps } from "../components/blocks/Block";

export type PageData = {
  blocks: {
    type: string;
    data?: BlockProps;
  }[];
};

export type PagesDictionary = Record<string, PageData>;

const pages = {
  "/": {
    blocks: [
      {
        type: "login",
        data: {
          title: "Login or Register",
          settings: { isprimaryContent: true, width: "sm" },
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
          settings: { isprimaryContent: true, width: "sm" },
        },
      },
    ],
  },
} as PagesDictionary;

export default pages;
