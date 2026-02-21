import Heading, { HeadingLevelProvider } from "../common/Heading";
import Text from "../common/Text";

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
          <Heading
            headingSize="xs"
            headingStyles="capitalize line-clamp-1 text-secondary-content/70"
          >
            {title}
          </Heading>
          <Text textSize="xs" className="line-clamp-1">
            {description}
          </Text>
        </HeadingLevelProvider>
      </div>
    </div>
  );
}

export default BasicCard;
