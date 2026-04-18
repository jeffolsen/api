import Button from "../common/Button";
import Heading from "../common/Heading";
import Text from "../common/Text";
import dayjs, { longDatetime, techDatetime } from "../../utils/dayjs";
import { TProfile } from "../../network/profile";
import { PropsWithChildren } from "react";
import { paths } from "../../config/routes";

type DashBoardLayoutProps = PropsWithChildren<{
  profile: TProfile;
}>;

function DashBoardLayout({ profile, children }: DashBoardLayoutProps) {
  return (
    <>
      <Heading
        headingSize="lg"
        headingDecorator="none"
        headingStyles="text-center bold mt-8 text-accent tracking-widest italic"
      >
        {profile?.email}
      </Heading>
      <div className="flex flex-col items-center gap-2">
        <Text textSize="lg" className="text-center text-neutral-content/90">
          Member since {dayjs(profile?.createdAt).format(longDatetime)}
        </Text>
        <Text textSize="sm" className="text-center text-neutral-content/70">
          Last updated: {dayjs(profile?.updatedAt).format(techDatetime)}
        </Text>
      </div>
      <div className="flex justify-center gap-1 md:gap-4 mx-auto mt-8 w-full max-w-3xl">
        <Button
          as="Link"
          color="primary"
          className="flex-1 md:w-auto"
          to={paths.cmsItemsList}
        >
          Items
        </Button>
        <Button
          as="Link"
          color="primary"
          className="flex-1 md:w-auto"
          to={paths.cmsFeedsList}
        >
          Feeds
        </Button>
        <Button
          as="Link"
          color="primary"
          className="flex-1 md:w-auto"
          to={paths.cmsHome}
        >
          Home
        </Button>
      </div>
      {children}
    </>
  );
}

export default DashBoardLayout;
