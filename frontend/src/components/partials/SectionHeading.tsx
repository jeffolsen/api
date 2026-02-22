import { PropsWithChildren } from "react";
import Heading from "../common/Heading";

function SectionHeading({
  text,
  children,
}: PropsWithChildren & { text: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-6 mt-8">
      <div className="flex-grow">
        <Heading
          headingSize="md"
          headingDecorator="right-strike"
          headingStyles="text-center capitalize bold text-primary-content"
        >
          {text}
        </Heading>
      </div>
      <div className="flex flex-grow items-center justify-center gap-4 md:flex-grow-0  w-full sm:w-auto">
        {children}
      </div>
    </div>
  );
}

export default SectionHeading;
