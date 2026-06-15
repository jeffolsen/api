import ScrollInFade from "@/components/common/ScrollInFade";
import clsx, { ClassValue } from "clsx";
import { ReactNode } from "react";

type VertCardProps = {
  passage?: ReactNode;
  imagery?: ReactNode;
  overLay?: ReactNode;
  underLay?: ReactNode;
  reverseY?: boolean;
  critical?: boolean;
  className?: ClassValue;
};

const VertCard = ({
  passage,
  imagery,
  overLay,
  underLay,
  reverseY = false,
  critical = false,
  className,
}: VertCardProps) => {
  return (
    <ScrollInFade
      className={clsx(["relative group h-full"])}
      critical={critical}
    >
      <div
        className={clsx([
          "card w-full overflow-clip",
          className,
          reverseY && "flex-col-reverse",
        ])}
      >
        {imagery && <figure className={"w-full"}>{imagery}</figure>}
        {passage && <div className={"card-body w-full"}>{passage}</div>}
      </div>
      {overLay && <div className="absolute inset-0 z-10">{overLay}</div>}
      {underLay && <div className="absolute inset-0 -z-10">{underLay}</div>}
    </ScrollInFade>
  );
};

export default VertCard;
