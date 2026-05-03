import { useLocation } from "react-router";
import Button from "../common/Button";
import { paths } from "@/config/routes";

export default function CmsSubNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="flex justify-center gap-1 md:gap-4 mx-auto mt-8 w-full max-w-3xl">
      <Button
        as="Link"
        color={path === paths.cmsItemsList ? "secondary" : "neutral"}
        className="flex-1 md:w-auto"
        size="lg"
        to={paths.cmsItemsList}
      >
        Items
      </Button>
      <Button
        as="Link"
        color={path === paths.cmsFeedsList ? "secondary" : "neutral"}
        className="flex-1 md:w-auto"
        size="lg"
        to={paths.cmsFeedsList}
      >
        Feeds
      </Button>
      <Button
        as="Link"
        color={path === paths.cmsHome ? "secondary" : "neutral"}
        className="flex-1 md:w-auto"
        size="lg"
        to={paths.cmsHome}
      >
        Settings
      </Button>
    </div>
  );
}
