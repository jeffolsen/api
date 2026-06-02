import ScrollInFade from "@/components/common/ScrollInFade";
import clsx, { ClassValue } from "clsx";
import { ReactNode } from "react";

type ResponsiveCardProps = {
  passage?: ReactNode;
  imagery?: ReactNode;
  overLay?: ReactNode;
  underLay?: ReactNode;
  reverseX?: boolean;
  reverseY?: boolean;
  className?: ClassValue;
};

const ResponsiveCard = ({
  passage,
  imagery,
  overLay,
  underLay,
  reverseX = false,
  reverseY = false,
  className,
}: ResponsiveCardProps) => {
  return (
    <ScrollInFade className={clsx(["relative group"])}>
      <div
        className={clsx([
          "card md:card-side w-full overflow-clip",
          className,
          reverseX && "md:flex-row-reverse",
          reverseY && "flex-col-reverse",
        ])}
      >
        {imagery && (
          <figure
            className={!passage ? "w-full" : "w-full flex-none md:w-auto"}
          >
            {imagery}
          </figure>
        )}
        {passage && (
          <div className={!imagery ? "card-body w-full" : "card-body"}>
            {passage}
          </div>
        )}
      </div>
      {overLay && <div className="absolute inset-0 z-10">{overLay}</div>}
      {underLay && <div className="absolute inset-0 -z-10">{underLay}</div>}
    </ScrollInFade>
  );
};

export default ResponsiveCard;
