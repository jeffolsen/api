import { HeadingLevelProvider } from "@/components/common/Heading";

function EmptyCard({ children }: { children: React.ReactNode }) {
  return (
    <HeadingLevelProvider>
      <div className="card card-compact md:card-normal card-bordered border-t-gray-400/30 md:card-side shadow-xl h-full w-full bg-base-100 text-base/80">
        {children}
      </div>
    </HeadingLevelProvider>
  );
}

export default EmptyCard;
