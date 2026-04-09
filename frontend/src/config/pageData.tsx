import { BlockProps } from "../components/blocks/Block";

export type BlockType = {
  type: string;
  data?: BlockProps;
};

export type PageData = {
  redirectTo?: string;
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
            isPrimaryContent: true,
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
            isPrimaryContent: true,
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
            isPrimaryContent: true,
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
            isPrimaryContent: true,
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
            isPrimaryContent: true,
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
        type: "feedsList",
        data: {
          id: 4,
          title: "Feeds",
          settings: {
            isPrimaryContent: true,
            showOnLoggedinState: "LOGGED_IN",
            width: "lg",
          },
        },
      },
    ],
  },
  "feeds/new": {
    blocks: [
      {
        type: "feedCreate",
        data: {
          id: 4,
          title: "Create a new feed",
          settings: {
            isPrimaryContent: true,
            showOnLoggedinState: "LOGGED_IN",
            width: "md",
          },
        },
      },
    ],
  },
  "feeds/:id": {
    blocks: [
      {
        type: "feedUpdate",
        data: {
          id: 4,
          title: "Edit feed",
          settings: {
            isPrimaryContent: true,
            showOnLoggedinState: "LOGGED_IN",
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
            isPrimaryContent: true,
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
            isPrimaryContent: true,
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
            isPrimaryContent: true,
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
            isPrimaryContent: true,
            showOnLoggedinState: "BOTH",
            width: "sm",
          },
        },
      },
    ],
  },
} as PagesDictionary;

export default pages;
