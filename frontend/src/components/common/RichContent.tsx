import Text from "./Text";
import List, { ListItem } from "./List";
import type { JSONContent } from "@tiptap/core";
import clsx from "clsx";

type RichContent = {
  richContent: JSONContent | undefined;
  parent?: "li" | "ul" | "ol" | "p";
};
function RichContent({ richContent, parent }: RichContent) {
  if (!richContent) return null;

  // Handle the root document container

  if (richContent.type === "text") {
    // Optional chaining safely accesses marks and attrs
    const marks = richContent.marks;

    if (marks?.length) {
      return (
        <Text
          as="span"
          textSize={
            marks.find((mark) => mark.type === "pseudoHeading") ? "lg" : "md"
          }
          className={clsx([
            marks.map((mark) => {
              if (mark.type === "italic") return "italic";
              if (mark.type === "bold") return "font-extrabold";
              else if (mark.type === "pseudoHeading")
                return "font-bold uppercase underline underline-offset-8";
              return null;
            }),
          ])}
        >
          {richContent.text}
        </Text>
      );
    }

    return (
      <Text as="span" textSize="md">
        {richContent.text}
      </Text>
    );
  }

  if (richContent.type === "hardBreak") {
    return <br />;
  }

  if (richContent.type === "paragraph") {
    return (
      <p className={clsx([parent === "li" && "inline my-0"])}>
        {richContent.content?.map((child, index) => (
          <RichContent key={index} richContent={child} />
        ))}
      </p>
    );
  }

  if (richContent.type === "orderedList") {
    return (
      <List textSize="md" as="ol">
        {richContent.content?.map((child, index) => (
          <RichContent key={index} richContent={child} />
        ))}
      </List>
    );
  }

  if (richContent.type === "bulletList") {
    return (
      <List textSize="md">
        {richContent.content?.map((child, index) => (
          <RichContent key={index} richContent={child} />
        ))}
      </List>
    );
  }

  if (richContent.type === "listItem") {
    return (
      <ListItem>
        {richContent.content?.map((child, index) => (
          <RichContent key={index} richContent={child} parent={"li"} />
        ))}
      </ListItem>
    );
  }

  if (richContent.type === "doc") {
    return (
      <div className={clsx(["prose max-w-full"])}>
        {richContent?.content?.map((child, index) => (
          <RichContent key={index} richContent={child} parent={undefined} />
        ))}
      </div>
    );
  }

  return null;
}

export default RichContent;
