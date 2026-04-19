import { HeadingLevelProvider } from "../common/Heading";
import Button from "../common/Button";
import { TComponent } from "../../network/component";
import BreadCrumbs from "./BreadCrumbs";
import { useLoaderData } from "react-router";
import { Suspense } from "react";
import Blocks from "../blocks/Blocks";
import ThemeToggle from "../partials/ThemeToggle";
import clsx from "clsx";
import Logo from "../partials/Logo";
import HeaderImageSpread from "../partials/HeaderImageSpread";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "CMS", to: "/cms" },
  { label: "CV", to: "/cv" },
];

function Header() {
  const data = useLoaderData();
  const hero = data.pageLayout.components.find(
    (c: TComponent) =>
      c.typeName === "HeroCarousel" && c.propertyValues.location === "header",
  );

  return (
    <HeadingLevelProvider>
      <header
        className={clsx([
          "flex justify-center",
          "top-0 sticky z-10",
          "bg-base-200/90 backdrop-blur-sm",
        ])}
      >
        <div
          className={clsx([
            "flex items-center justify-between",
            "w-full max-w-screen-2xl",
          ])}
        >
          <Logo />
          <div className="flex-grow flex items-center justify-end md:justify-between md:flex-row-reverse">
            <ThemeToggle />
            <div className="divider bg-base-content md:hidden w-0.5" />
            <DesktopNav />
            <MobileNav />
          </div>
        </div>
      </header>
      {hero && (
        <Suspense fallback={null}>
          <Blocks.HeroCarousel component={hero} params={{}} path="" />
        </Suspense>
      )}
      <HeaderImageSpread />
      <BreadCrumbs />
    </HeadingLevelProvider>
  );
}

function DesktopNav() {
  return (
    <ul className="navbar md:flex hidden">
      {navItems.map((item) => (
        <li key={item.to}>
          <Button to={item.to} as="Link" color="ghost" size="lg">
            {item.label}
          </Button>
        </li>
      ))}
    </ul>
  );
}

function MobileNav() {
  return (
    <div className="dropdown md:hidden">
      <label tabIndex={0} className="btn btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h8m-8 6h16"
          />
        </svg>
      </label>
      <ul
        tabIndex={0}
        className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
      >
        {navItems.map((item) => (
          <li key={item.to}>
            <Button to={item.to} as="Link" color="ghost" size="lg">
              {item.label}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Header;
