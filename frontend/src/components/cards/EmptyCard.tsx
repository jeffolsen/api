import { HeadingLevelProvider } from "../common/Heading";

function EmptyCard({ children }: { children: React.ReactNode }) {
  return (
    <HeadingLevelProvider>
      <div className="card card-compact md:card-normal card-bordered md:card-side shadow-xl h-full w-full bg-neutral text-neutral-content/80">
        {children}
      </div>
    </HeadingLevelProvider>
  );
}

export default EmptyCard;
