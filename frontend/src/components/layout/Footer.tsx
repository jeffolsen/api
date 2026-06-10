import { HeadingLevelProvider } from "@/components/common/Heading";
import Link from "@/components/common/Link";
import Text from "../common/Text";
import clsx from "clsx";
import { Download } from "lucide-react";

function Footer() {
  return (
    <HeadingLevelProvider>
      <footer
        className={clsx([
          "flex flex-col xl:flex-row justify-center bg-base-300 min-h-36 p-8 text-base-content gap-16",
        ])}
      >
        <div
          className={clsx([
            "footer w-full max-w-screen-xl flex justify-center lg:justify-start lg:gap-8 divide-x-2 divide-base-content",
          ])}
        >
          <ul className="flex flex-col gap-4 lg:gap-8 lg:flex-row lg:flex-none flex-1">
            <li>
              <Link
                as="a"
                href="https://github.com/jeffolsen"
                size="lg"
                linkColor="base"
                target="_blank"
              >
                Github
              </Link>
            </li>
            <li>
              <Link
                as="a"
                href="https://www.linkedin.com/in/jeff-olsen-ba409b27/"
                size="lg"
                linkColor="base"
                target="_blank"
              >
                LinkedIn
              </Link>
            </li>
            <li>
              <Link
                size="lg"
                as="a"
                linkColor="base"
                href={"/pdfs/resume.pdf"}
                className={"flex gap-2"}
                target="_blank"
              >
                Resume <Download />
              </Link>
            </li>
          </ul>
          <ul className="flex flex-col gap-4 lg:gap-8 lg:flex-row lg:flex-none flex-1 pl-8">
            <li>
              <Link to="/privacy" size="lg" linkColor="base">
                Privacy
              </Link>
            </li>
            <li>
              <Link to="/terms" size="lg" linkColor="base">
                Terms
              </Link>
            </li>
            <li>
              <Link to="/cookies" size="lg" linkColor="base">
                Cookies
              </Link>
            </li>
          </ul>
        </div>
        <div
          className={clsx([
            "flex-none flex flex-col gap-4 justify-between text-left lg:text-right w-full lg:w-auto pb-8",
          ])}
        >
          <Link
            as="a"
            href="mailto:info@meetjeffolsen.com"
            size="md"
            linkColor="base"
          >
            info@meetjeffolsen.com
          </Link>
          <Text textSize="md">© 2026 Jeff Olsen. All Rights Reserved.</Text>
        </div>
      </footer>
    </HeadingLevelProvider>
  );
}

export default Footer;
