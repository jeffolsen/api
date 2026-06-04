import ScrollInFade from "@/components/common/ScrollInFade";
import clsx, { ClassValue } from "clsx";
import { ReactNode } from "react";

type ResponsiveCardProps = {
  passage?: ReactNode;
  imagery?: ReactNode;
  overLay?: ReactNode;
  underLay?: ReactNode;
  changeAt?: "md" | "lg" | "xl";
  reverseX?: boolean;
  reverseY?: boolean;
  className?: ClassValue;
};

const ResponsiveCard = ({
  passage,
  imagery,
  overLay,
  underLay,
  changeAt = "md",
  reverseX = false,
  reverseY = false,
  className,
}: ResponsiveCardProps) => {
  return (
    <ScrollInFade className={clsx(["relative group h-full"])}>
      <div
        className={clsx([
          "card w-full overflow-clip",
          className,
          changeAt === "md" && "md:card-side",
          changeAt === "lg" && "lg:card-side",
          changeAt === "xl" && "xl:card-side",
          reverseX && changeAt === "md" && "md:flex-row-reverse",
          reverseX && changeAt === "lg" && "lg:flex-row-reverse",
          reverseX && changeAt === "xl" && "xl:flex-row-reverse",
          reverseY && "flex-col-reverse",
        ])}
      >
        {imagery && (
          <figure
            className={clsx([
              passage && changeAt === "md" && "w-full flex-none md:w-auto",
              passage && changeAt === "lg" && "w-full flex-none lg:w-auto",
              passage && changeAt === "xl" && "w-full flex-none xl:w-auto",
              !passage && "w-full",
            ])}
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
