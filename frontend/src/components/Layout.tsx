import { PropsWithChildren } from "react";
import Header from "./Header";
import Footer from "./Footer";

function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default Layout;
