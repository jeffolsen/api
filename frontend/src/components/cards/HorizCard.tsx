import ScrollInFade from "@/components/common/ScrollInFade";
import clsx, { ClassValue } from "clsx";
import { ReactNode } from "react";

type HorizCardProps = {
  passage?: ReactNode;
  imagery?: ReactNode;
  overLay?: ReactNode;
  underLay?: ReactNode;
  reverseX?: boolean;
  className?: ClassValue;
};

const HorizCard = ({
  passage,
  imagery,
  overLay,
  underLay,
  reverseX = false,
  className,
}: HorizCardProps) => {
  return (
    <ScrollInFade className={clsx(["relative group h-full"])}>
      <div
        className={clsx([
          "card card-side w-full overflow-clip",
          className,
          reverseX && "flex-row-reverse",
        ])}
      >
        {imagery && (
          <figure className={!passage ? "w-full" : "flex-none"}>
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

export default HorizCard;
