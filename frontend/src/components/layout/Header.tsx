import { HeadingLevelProvider } from "@/components/common/Heading";
import Button from "@/components/common/Button";
import { TComponent } from "@/network/component";
import BreadCrumbs from "@/components/layout/BreadCrumbs";
import { useLoaderData } from "react-router";
import { Suspense } from "react";
import Blocks from "@/components/blocks/Blocks";
import ThemeToggle from "@/components/partials/ThemeToggle";
import clsx from "clsx";
import Logo from "@/components/partials/Logo";
import HeaderImageSpread from "@/components/partials/HeaderImageSpread";
import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import LogoutButton from "@/components/partials/LogoutButton";

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
          "flex flex-col bg-neutral",
          "max-h-lvh md:max-h-auto",
          hero &&
            "h-[calc(100lvh-64px)] sm:h-[calc(100lvh-82px)] md:h-[calc(100lvh-86px)] z-20 relative",
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
    <Popover>
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
      <PopoverBackdrop className="fixed inset-0 bg-black/30 z-40 h-screen" />
      <PopoverPanel className="absolute w-full sm:w-[75vw] right-0 mt-2 bg-neutral rounded-md shadow-lg p-4  z-50">
        {({ close }) => (
          <div className="flex flex-col" onClick={() => close()}>
            {navItems.map((item) => (
              <Button
                key={item.to}
                to={item.to}
                as="Link"
                color="ghost"
                size="lg"
              >
                {item.label}
              </Button>
            ))}
            <LogoutButton />
          </div>
        )}
      </PopoverPanel>
    </Popover>
  );
}

export default Header;
