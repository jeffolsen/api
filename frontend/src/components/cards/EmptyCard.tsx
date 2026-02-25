import { HeadingLevelProvider } from "../common/Heading";

function EmptyCard({ children }: { children: React.ReactNode }) {
  return (
    <HeadingLevelProvider>
      <div className="card md:card-side bg-secondary shadow-xl h-full w-full text-secondary-content">
        {children}
      </div>
    </HeadingLevelProvider>
  );
}

export default EmptyCard;
