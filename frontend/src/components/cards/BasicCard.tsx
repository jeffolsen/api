import Heading from "../common/Heading";
import Text from "../common/Text";
import EmptyCard from "./EmptyCard";
import { PropsWithChildren } from "react";

export type BasicCardProps = {
  title?: string;
  description?: string;
  clamp?: boolean;
};

function BasicCard({
  title,
  description,
  clamp = true,
  children,
}: PropsWithChildren<BasicCardProps>) {
  return (
    <EmptyCard>
      <div className="card-body">
        {title && (
          <Heading
            headingSize="xs"
            headingStyles={"capitalize" + (clamp ? " line-clamp-1" : "")}
          >
            {title}
          </Heading>
        )}
        {description && (
          <Text textSize="xs" className={clamp ? "line-clamp-1" : ""}>
            {description}
          </Text>
        )}
        {children}
      </div>
    </EmptyCard>
  );
}

export default BasicCard;
