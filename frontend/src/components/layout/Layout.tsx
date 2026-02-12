import { PropsWithChildren } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { HeadingLevelProvider } from "../common/Heading";
import { ModalProvider } from "../../contexts/ModalProvider";
import ModalManager from "../modals/Modal";

function Layout({ children }: PropsWithChildren) {
  return (
    <ModalProvider>
      <HeadingLevelProvider>
        <div className="min-h-screen flex flex-col justify-between">
          <Header />
          <main className="flex-grow flex flex-col gap-8 items-center justify-center py-8">
            {children}
          </main>
          <Footer />
        </div>
        <ModalManager />
      </HeadingLevelProvider>
    </ModalProvider>
  );
}

export default Layout;
