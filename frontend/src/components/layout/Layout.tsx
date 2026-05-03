import { PropsWithChildren } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { HeadingLevelProvider } from "@/components/common/Heading";
import { TComponent } from "@/network/component";
import clsx from "clsx";
import ContentBackground from "../partials/ContentBackground";

function Layout({
  children,
}: PropsWithChildren & { headerHero?: TComponent | null }) {
  return (
    <HeadingLevelProvider>
      <div className="min-h-screen flex flex-col justify-between relative">
        <Header />
        <main
          id="main-content"
          className={clsx([
            "flex-grow flex flex-col items-center justify-start z-0",
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

// style={{
//   backgroundImage: `linear-gradient(to top, oklch(var(--b1)), oklch(var(--b3))), url(${myImage})`,
//   backgroundSize: "100% 100%, 1000px 1000px",
//   backgroundRepeat: "no-repeat, repeat",
// }}
