export type TTagName =
  | "PERSON"
  | "PLACE"
  | "THING"
  | "PAST"
  | "PRESENT"
  | "FUTURE"
  | "RED"
  | "BLUE"
  | "GREEN"
  | "FOO"
  | "BAR"
  | "BAZ";

export type TTag = {
  id: number;
  name: TTagName;
};

export type TTagInput = Omit<TTag, "id">;
