import { PropsWithChildren } from "react";
import Heading from "../common/Heading";
import Text from "../common/Text";

function SectionHeading({
  text,
  description,
  children,
}: PropsWithChildren & { text: string; description?: string }) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mt-8">
        <div className="flex-grow">
          <Heading
            headingSize="md"
            headingDecorator="right-strike"
            headingStyles="text-center capitalize bold text-primary-content"
          >
            {text}
          </Heading>
        </div>

        {description && (
          <Text
            textSize="sm"
            className="text-primary-content/70 w-full md:order-last md:ml-8 md:mb-2"
          >
            {description}
          </Text>
        )}

        <div className="flex flex-grow items-center justify-center gap-4 md:flex-grow-0  w-full sm:w-auto">
          {children}
        </div>
      </div>
    </>
  );
}

export default SectionHeading;
