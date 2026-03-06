import { PropsWithChildren } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { HeadingLevelProvider } from "../common/Heading";
import BreadCrumbs from "./BreadCrumbs";

function Layout({ children }: PropsWithChildren) {
  return (
    <HeadingLevelProvider>
      <div className="min-h-screen flex flex-col justify-between bg-base-100">
        <Header />
        <main className="flex-grow flex flex-col gap-6 items-center justify-center py-6">
          <BreadCrumbs />
          {children}
        </main>
        <Footer />
      </div>
    </HeadingLevelProvider>
  );
}

export default Layout;
