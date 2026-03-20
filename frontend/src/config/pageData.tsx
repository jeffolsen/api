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
  home: {
    blocks: [
      {
        type: "login",
        data: {
          id: 1,
          title: "Login or register",
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
          id: 2,
          title: "Dashboard",
          settings: {
            isprimaryContent: true,
            showOnLoggedinState: "LOGGED_IN",
            width: "lg",
          },
        },
      },
    ],
  },
  items: {
    blocks: [
      {
        type: "itemsList",
        data: {
          id: 3,
          title: "Items",
          settings: {
            isprimaryContent: true,
            showOnLoggedinState: "LOGGED_IN",
            width: "lg",
          },
        },
      },
    ],
  },
  "items/new": {
    blocks: [
      {
        type: "createItem",
        data: {
          id: 3,
          title: "Create a new item",
          settings: {
            isprimaryContent: true,
            showOnLoggedinState: "LOGGED_IN",
            width: "md",
          },
        },
      },
    ],
  },
  "items/:id": {
    blocks: [
      {
        type: "updateItem",
        data: {
          id: 3,
          title: "Edit item",
          settings: {
            isprimaryContent: true,
            showOnLoggedinState: "LOGGED_IN",
            width: "md",
          },
        },
      },
    ],
  },
  feeds: {
    blocks: [
      {
        type: "generic",
        data: {
          id: 4,
          title: "Feeds",
          settings: {
            isprimaryContent: true,
            showOnLoggedinState: "BOTH",
            width: "md",
          },
        },
      },
    ],
  },
  about: {
    blocks: [
      {
        type: "generic",
        data: {
          id: 5,
          title: "About me",
          settings: {
            isprimaryContent: true,
            showOnLoggedinState: "BOTH",
            width: "md",
          },
        },
      },
    ],
  },
  "style-guide": {
    blocks: [
      {
        type: "styleGuide",
        data: {
          id: 6,
          title: "Style guide",
          settings: {
            isprimaryContent: true,
            showOnLoggedinState: "BOTH",
            width: "md",
          },
        },
      },
    ],
  },
  "401": {
    blocks: [
      {
        type: "401",
        data: {
          id: 8,
          title: "Access denied",
          settings: {
            isprimaryContent: true,
            showOnLoggedinState: "BOTH",
            width: "sm",
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
          id: 7,
          title: "Page not found",
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
