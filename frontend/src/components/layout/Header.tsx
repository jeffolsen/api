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
import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";

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
          "top-0 sticky z-30",
          "bg-neutral text-neutral-content backdrop-blur-sm shadow-lg",
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
            <div className="divider bg-neutral-content md:hidden w-px my-0 h-auto" />
            <DesktopNav />
            <MobileNav />
          </div>
        </div>
      </header>
      <div
        className={clsx([
          "flex flex-col gap-2 bg-neutral",
          "max-h-lvh md:max-h-auto",
          hero &&
            "h-[calc(100lvh-64px)] sm:h-[calc(100lvh-82px)] md:h-[calc(100lvh-86px)]  z-20 relative",
        ])}
      >
        {hero && (
          <div className="flex-grow">
            <Suspense
              fallback={<div className="skeleton w-full h-full bg-base-100" />}
            >
              <Blocks.HeroCarousel
                component={{ ...hero, name: "" }}
                params={{}}
                path=""
              />
            </Suspense>
          </div>
        )}
        <HeaderImageSpread />
      </div>
      <div className="bg-secondary text-secondary-content top-[64px] sm:top-[82px] mdtop-[86px] sticky z-20 shadow-lg">
        <BreadCrumbs />
      </div>
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
    <Popover className="relative">
      <PopoverButton className="btn btn-ghost btn-lg md:hidden">
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
      </PopoverButton>
      <PopoverBackdrop className="fixed inset-0 bg-base-300" />
      <PopoverPanel className="absolute w-[75vw] right-0 mt-2 bg-base-300 rounded-md shadow-lg p-4">
        {navItems.map((item) => (
          <Button
            key={item.to}
            to={item.to}
            as="Link"
            color="ghost"
            size="lg"
            className="w-full text-left"
          >
            {item.label}
          </Button>
        ))}
      </PopoverPanel>
    </Popover>
  );
}

export default Header;
