import { PropsWithChildren } from "react";
import Heading from "../common/Heading";
import Tooltip from "../common/Tooltip";
import Text from "../common/Text";

function SectionHeading({
  text,
  tooltipText,
  children,
}: PropsWithChildren & { text: string; tooltipText?: string }) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-6 mt-8">
        <div className="flex-grow">
          <Heading
            headingSize="md"
            headingDecorator="right-strike"
            headingStyles="text-center capitalize bold text-primary-content"
          >
            <span className="flex items-center gap-2">
              {text}
              {tooltipText && <Tooltip text={tooltipText} />}
            </span>
          </Heading>
        </div>
        <Text
          textSize="sm"
          className="md:hidden text-primary-content/70 w-full"
        >
          {tooltipText}
        </Text>
        <div className="flex flex-grow items-center justify-center gap-4 md:flex-grow-0  w-full sm:w-auto">
          {children}
        </div>
      </div>
    </>
  );
}

export default SectionHeading;
