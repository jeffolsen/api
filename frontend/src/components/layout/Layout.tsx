import { PropsWithChildren } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { HeadingLevelProvider } from "../common/Heading";
import { TComponent } from "../../network/component";

function Layout({
  headerHero,
  children,
}: PropsWithChildren & { headerHero?: TComponent | null }) {
  return (
    <HeadingLevelProvider>
      <div className="min-h-screen flex flex-col justify-between bg-base-100">
        <Header hero={headerHero} />
        <main className="flex-grow flex flex-col gap-6 items-center justify-start py-6">
          {children}
        </main>
        <Footer />
      </div>
    </HeadingLevelProvider>
  );
}

export default Layout;
