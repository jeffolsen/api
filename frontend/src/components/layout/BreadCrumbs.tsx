import { useLocation } from "react-router";
import Link from "@/components/common/Link";
import Text from "../common/Text";
import clsx from "clsx";
import { paths } from "@/config/routes";

function BreadCrumbs() {
  const location = useLocation();
  const path = location.pathname.replace(/^\/|\/$/g, "");
  const preview = paths.cmsPreview.replace(/^\/|\/$/g, "");
  const pathSegments = path.split("/").filter(Boolean);
  const crumbs = ["home"];
  let accumulatedPath = "";

  pathSegments.forEach((_, index) => {
    if (accumulatedPath.startsWith(preview)) return;
    accumulatedPath = "";
    pathSegments.forEach((seg, segIndex) => {
      console.log("accumulatedPath", accumulatedPath, "seg", seg);
      if (accumulatedPath.startsWith(preview)) {
        accumulatedPath += `/${seg}`;
        return;
      }
      if (segIndex > index) return;
      if (accumulatedPath) {
        accumulatedPath += `/${seg}`;
      } else {
        accumulatedPath = seg;
      }
    });
    crumbs.push(accumulatedPath);
  });

  return (
    <div className="breadcrumbs text-sm">
      <ul className="flex md:gap-8 justify-center">
        {crumbs.map((crumb, index) => (
          <li
            key={index}
            className={clsx([
              "uppercase font-bold flex md:gap-8 italic",
              "before:!opacity-100 before:!border-t-2 before:!border-r-2 first:before:hidden",
            ])}
          >
            <>
              {index < crumbs.length - 1 ? (
                <Link
                  to={`/${crumb === "home" ? "" : crumb}`}
                  className={"font-extrabold"}
                  size="md"
                >
                  {crumb.replaceAll("/", ` ${String.fromCharCode(8226)} `)}
                </Link>
              ) : (
                <Text
                  as="span"
                  textSize="md"
                  className="underline underline-offset-4 font-extrabold"
                >
                  {crumb.replaceAll("/", ` ${String.fromCharCode(8226)} `)}
                </Text>
              )}
            </>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BreadCrumbs;
