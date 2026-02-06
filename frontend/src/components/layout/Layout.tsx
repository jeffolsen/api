import { PropsWithChildren } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { HeadingLevelProvider } from "../common/Heading";

function Layout({ children }: PropsWithChildren) {
  return (
    <HeadingLevelProvider>
      <div className="min-h-screen flex flex-col justify-between">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </HeadingLevelProvider>
  );
}

export default Layout;
