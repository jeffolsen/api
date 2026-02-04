import { PropsWithChildren } from "react";

const Wrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex items-start justify-center px-6">
      <div className="max-w-6xl w-full h-full">{children}</div>
    </div>
  );
};

export default Wrapper;
