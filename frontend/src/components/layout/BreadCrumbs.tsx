import { useLocation } from "@tanstack/react-router";
import Link from "@/components/common/Link";
import Text from "../common/Text";
import clsx from "clsx";
import { paths } from "@/config/routes";

function BreadCrumbs() {
  const location = useLocation();
  const path = location.pathname.replace(/^\/|\/$/g, "");
  const preview = paths.cmsPreview.replace(/^\/|\/$/g, "");
  const pathSegments = path.split("/").filter(Boolean);
  const crumbs = [{ label: "home", path: "/" }];
  let accumulatedPath = "";

  pathSegments.forEach((_, index) => {
    if (accumulatedPath.startsWith(preview)) return;
    accumulatedPath = "";
    pathSegments.forEach((seg, segIndex) => {
      // console.log("accumulatedPath", accumulatedPath, "seg", seg);
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

    const segments = accumulatedPath.split("/");
    crumbs.push({
      label: segments[segments.length - 1],
      path: accumulatedPath,
    });
  });

  return (
    <div className="breadcrumbs text-sm max-w-full">
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
                  to={`/${crumb.path}`}
                  className={"font-extrabold whitespace-nowrap"}
                  size="md"
                >
                  {crumb.label.replaceAll(
                    "/",
                    ` ${String.fromCharCode(8226)} `,
                  )}
                </Link>
              ) : (
                <Text
                  as="span"
                  textSize="md"
                  className="underline underline-offset-4 font-extrabold whitespace-nowrap!"
                >
                  {crumb.label.replaceAll(
                    "/",
                    ` ${String.fromCharCode(8226)} `,
                  )}
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
