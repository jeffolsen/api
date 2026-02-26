import clsx, { ClassValue } from "clsx";
import { PropsWithChildren } from "react";
import { InfoIcon } from "lucide-react";

type TooltipProps = {
  className?: ClassValue;
  text: string;
  children?: React.ReactNode;
};

function Tooltip({
  children,
  className,
  text,
}: PropsWithChildren<TooltipProps>) {
  return (
    <div
      className={clsx(
        "tooltip",
        className ||
          "tooltip-right tooltip-secondary font-light text-left text-sm tracking-normal normal-case",
      )}
      data-tip={text}
    >
      {children || (
        <InfoIcon className="w-6 h-6 text-secondary hidden md:inline-block" />
      )}
    </div>
  );
}

export default Tooltip;
