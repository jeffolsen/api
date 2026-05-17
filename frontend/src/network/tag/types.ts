export const TAGS_KEY = "tags" as const;

export type TTagName =
  | "PERSON"
  | "PLACE"
  | "THING"
  | "FOO"
  | "BAR"
  | "BAZ"
  | "COMIC BOOKS"
  | "VIDEO GAMES"
  | "TABLETOP RPGS"
  | "ART"
  | "MOVIES"
  | "MUSIC"
  | "TYPESCRIPT"
  | "REACT"
  | "NODE"
  | "EXPRESS"
  | "NEXTJS"
  | "TAILWIND"
  | "UX"
  | "COLLABORATION"
  | "DEVELOPMENT"
  | "SCRUM"
  | "GIT"
  | "FOOD";
export type TTag = {
  id: number;
  name: TTagName;
};

export type GetTagsResponse = {
  tags: TTag[];
};

export type TTagInput = Omit<TTag, "id">;
