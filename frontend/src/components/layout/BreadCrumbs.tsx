import { useLocation } from "react-router";
import Link from "@/components/common/Link";

function BreadCrumbs() {
  const location = useLocation();
  const path = location.pathname.replace(/^\/|\/$/g, "");
  const pathSegments = path.split("/").filter(Boolean);
  const crumbs = ["home"];
  let accumulatedPath = "";

  pathSegments.forEach((_, index) => {
    accumulatedPath = "";
    pathSegments.forEach((seg, segIndex) => {
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
          <li key={index} className="uppercase font-bold flex md:gap-8">
            <>
              {index < crumbs.length - 1 ? (
                <Link
                  to={`/${crumb === "home" ? "" : crumb}`}
                  className={"font-bold "}
                >
                  {crumb.replaceAll("/", ` ${String.fromCharCode(8226)} `)}
                </Link>
              ) : (
                <span className="underline">
                  {crumb.replaceAll("/", ` ${String.fromCharCode(8226)} `)}
                </span>
              )}
            </>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BreadCrumbs;
