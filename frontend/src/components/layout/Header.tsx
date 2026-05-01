import { HeadingLevelProvider } from "@/components/common/Heading";
import Button from "@/components/common/Button";
import { TComponent } from "@/network/component";
import { useLoaderData, useLocation } from "react-router";
import ThemeToggle from "@/components/partials/ThemeToggle";
import clsx from "clsx";
import Logo from "@/components/partials/Logo";
import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import LogoutButton from "@/components/partials/LogoutButton";
import StickySubHeader from "../partials/StickySubHeader";
import HeaderHero from "../partials/HeaderHero";
import BreadCrumbs from "./BreadCrumbs";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "CMS", to: "/cms" },
  { label: "CV", to: "/cv" },
];

function Header() {
  const location = useLocation();
  const data = useLoaderData();
  const hero = data.pageLayout.components.find(
    (c: TComponent) =>
      c.typeName === "HeroCarousel" && c.propertyValues.location === "header",
  );

  console.log("location", location);

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
      <HeaderHero hero={hero} />
      <StickySubHeader>
        {location.pathname !== "/" ? <BreadCrumbs /> : <div className="h-4" />}
      </StickySubHeader>
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
