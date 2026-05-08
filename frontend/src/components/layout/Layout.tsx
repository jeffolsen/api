import { PropsWithChildren } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { HeadingLevelProvider } from "@/components/common/Heading";
import { TComponent } from "@/network/component/types";
import clsx from "clsx";
import ContentBackground from "../partials/ContentBackground";
import { widestWidth } from "../common/helpers/layoutStyles";

function Layout({
  children,
}: PropsWithChildren & { headerHero?: TComponent | null }) {
  return (
    <HeadingLevelProvider>
      <div className="min-h-screen flex flex-col justify-between relative z-0 bg-base-100">
        <Header />
        <main
          id="main-content"
          className={clsx([
            "flex-grow flex flex-col items-center justify-start mx-auto w-full relative z-10",
            widestWidth,
          ])}
        >
          {children}
        </main>
        <Footer />
        <ContentBackground />
      </div>
    </HeadingLevelProvider>
  );
}

export default Layout;
