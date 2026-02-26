import { HeadingLevelProvider } from "../common/Heading";

function EmptyCard({ children }: { children: React.ReactNode }) {
  return (
    <HeadingLevelProvider>
      <div className="card card-bordered md:card-side shadow-xl h-full w-full bg-neutral">
        {children}
      </div>
    </HeadingLevelProvider>
  );
}

export default EmptyCard;
