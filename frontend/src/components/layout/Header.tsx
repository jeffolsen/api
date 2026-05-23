import { HeadingLevelProvider } from "@/components/common/Heading";
import Button from "@/components/common/Button";
import { useLocation } from "@tanstack/react-router";
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
import { isAuthenticated } from "@/network/clients/api";
import { paths } from "@/config/routes";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "CV", to: "/cv" },
  { label: "CMS", to: "/cms" },
  { label: "Lib", to: "/cms/lib" },
];

function Header() {
  const location = useLocation();

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
          <div className="flex-grow flex items-center justify-end lg:justify-between lg:flex-row-reverse">
            <ThemeToggle />
            <div className="divider bg-neutral-content lg:hidden w-px my-0 h-auto" />
            <DesktopNav />
            <MobileNav />
          </div>
        </div>
      </header>
      <HeaderHero />
      <StickySubHeader>
        <div className="mx-auto max-w-screen-2xl w-full flex justify-start pl-4 md:pl-8">
          {location.pathname !== "/" ? (
            <BreadCrumbs />
          ) : (
            <div className="h-4" />
          )}
        </div>
      </StickySubHeader>
    </HeadingLevelProvider>
  );
}

function DesktopNav() {
  return (
    <ul className="navbar lg:flex hidden">
      {navItems.map((item) => (
        <li key={item.to}>
          <Button
            to={item.to}
            as="Link"
            color="ghost"
            size="lg"
            className={"text-xl"}
          >
            {item.label}
          </Button>
        </li>
      ))}
    </ul>
  );
}

function MobileNav() {
  const isLoggedIn = isAuthenticated();
  return (
    <Popover>
      <PopoverButton className="btn btn-ghost btn-lg lg:hidden">
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
                className={"text-xl"}
              >
                {item.label}
              </Button>
            ))}
            {isLoggedIn && (
              <>
                <Button
                  to={paths.cmsItemsList}
                  as="Link"
                  color="ghost"
                  size="lg"
                  className={"text-xl"}
                >
                  Your Items
                </Button>
                <Button
                  to={paths.cmsFeedsList}
                  as="Link"
                  color="ghost"
                  size="lg"
                  className={"text-xl"}
                >
                  Your Feeds
                </Button>
                <LogoutButton size="lg" />
              </>
            )}
          </div>
        )}
      </PopoverPanel>
    </Popover>
  );
}

export default Header;
