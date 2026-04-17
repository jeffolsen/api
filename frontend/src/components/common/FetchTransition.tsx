import { PropsWithChildren } from "react";

type FetchTransitionProps = {
  isFetching: boolean;
};
function FetchTransition({
  isFetching,
  children,
}: PropsWithChildren<FetchTransitionProps>) {
  return (
    <div
      className={
        isFetching
          ? "opacity-60 transition-opacity duration-300"
          : "transition-opacity duration-300"
      }
    >
      {children}
    </div>
  );
}

export default FetchTransition;
