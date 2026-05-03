import Heading from "@/components/common/Heading";
import Text from "@/components/common/Text";
import dayjs, { longDatetime, techDatetime } from "@/utils/dayjs";
import { TProfile } from "@/network/profile";
import { PropsWithChildren } from "react";
import CmsSubNav from "./CmsSubNav";

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
        <Text textSize="lg" className="text-center text-base/90">
          Member since {dayjs(profile?.createdAt).format(longDatetime)}
        </Text>
        <Text textSize="sm" className="text-center text-base/70">
          Last updated: {dayjs(profile?.updatedAt).format(techDatetime)}
        </Text>
      </div>
      <CmsSubNav />
      {children}
    </>
  );
}

export default DashBoardLayout;
