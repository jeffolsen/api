import { PropsWithChildren } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { HeadingLevelProvider } from "@/components/common/Heading";
import { TComponent } from "@/network/component";
import clsx from "clsx";
import {
  mainSpacing,
  mainVerticalPadding,
} from "@/components/common/helpers/layoutStyles";

function Layout({
  children,
}: PropsWithChildren & { headerHero?: TComponent | null }) {
  return (
    <HeadingLevelProvider>
      <div className="min-h-screen flex flex-col justify-between bg-base-200">
        <Header />
        <main
          className={clsx([
            "flex-grow flex flex-col items-center justify-start",
            mainVerticalPadding,
            mainSpacing,
          ])}
        >
          {children}
        </main>
        <Footer />
      </div>
    </HeadingLevelProvider>
  );
}

export default Layout;
