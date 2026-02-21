import Heading, { HeadingLevelProvider } from "../common/Heading";

function BasicCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="card card-side bg-secondary shadow-xl h-full w-full text-secondary-content">
      <div className="card-body">
        <HeadingLevelProvider>
          <Heading headingSize="xs" headingStyles="capitalize line-clamp-1">
            {title}
          </Heading>
          <p className="text-xs">{description}</p>
        </HeadingLevelProvider>
      </div>
    </div>
  );
}

export default BasicCard;
