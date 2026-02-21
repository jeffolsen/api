import { PropsWithChildren } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { HeadingLevelProvider } from "../common/Heading";

function Layout({ children }: PropsWithChildren) {
  return (
    <HeadingLevelProvider>
      <div className="min-h-screen flex flex-col justify-between bg-neutral">
        <Header />
        <main className="flex-grow flex flex-col gap-8 items-center justify-center py-8">
          {children}
        </main>
        <Footer />
      </div>
    </HeadingLevelProvider>
  );
}

export default Layout;
