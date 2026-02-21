import { LoaderCircleIcon } from "lucide-react";

function Loading() {
  return (
    <div className="flex flex-col items-center gap-4">
      <LoaderCircleIcon className="animate-spin" />
    </div>
  );
}

export default Loading;
