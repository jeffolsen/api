import Heading from "../common/Heading";
import Text from "../common/Text";
import EmptyCard from "./EmptyCard";
import { PropsWithChildren } from "react";

export type BasicCardProps = {
  title?: string;
  description?: string;
};

function BasicCard({
  title,
  description,
  children,
}: PropsWithChildren<BasicCardProps>) {
  return (
    <EmptyCard>
      {title || description ? (
        <div className="card-body flex-grow">
          {title && (
            <Heading
              headingSize="xs"
              headingStyles="capitalize line-clamp-1 text-secondary-content/70"
            >
              {title}
            </Heading>
          )}
          {description && (
            <Text textSize="xs" className="line-clamp-1">
              {description}
            </Text>
          )}
        </div>
      ) : null}
      {children}
    </EmptyCard>
  );
}

export default BasicCard;
