import { useLocation } from "react-router";
import Link from "@/components/common/Link";
import Wrapper from "@/components/common/Wrapper";

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

  if (crumbs.length <= 1) return null;

  return (
    <Wrapper width="md">
      <div className="breadcrumbs text-sm w-full">
        <ul className="flex md:gap-8 justify-center">
          {crumbs.map((crumb, index) => (
            <li key={index} className="uppercase font-semibold flex md:gap-8">
              <Link to={`/${crumb === "home" ? "" : crumb}`}>
                {crumb.replaceAll("/", ` ${String.fromCharCode(8226)} `)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Wrapper>
  );
}

export default BreadCrumbs;
