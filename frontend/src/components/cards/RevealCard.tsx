import BasicCard from "./BasicCard";
import { Button, XButton } from "../common/Button";
import { PropsWithChildren, useState } from "react";
import { ButtonColor } from "../common/helpers/contentStyles";

type RevealCardProps = {
  title?: string;
  description?: string;
  buttonLabel: string;
  buttonColor?: ButtonColor;
};

function RevealCard({
  title,
  description,
  buttonLabel,
  buttonColor = "primary",
  children,
}: PropsWithChildren<RevealCardProps>) {
  const [revealed, setRevealed] = useState(false);
  return (
    <BasicCard title={title} description={description} clamp={false}>
      <div className="card-actions justify-end">
        {revealed ? (
          <>
            {children} <XButton onClick={() => setRevealed(false)} />
          </>
        ) : (
          <Button
            color={buttonColor}
            onClick={() => {
              setRevealed(true);
            }}
          >
            {buttonLabel}
          </Button>
        )}
      </div>
    </BasicCard>
  );
}

export default RevealCard;
