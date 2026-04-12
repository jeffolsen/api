import { HeadingLevelProvider } from "../common/Heading";
import Link from "../common/Link";

function Footer() {
  return (
    <HeadingLevelProvider>
      <footer className="flex justify-center bg-base-300 min-h-36 p-8">
        <div className="footer w-full max-w-screen-xl">
          <ul className="menu menu-vertical md:menu-horizontal w-full">
            <Link as="a" href="">
              Github
            </Link>
            <Link as="a" href="">
              LinkedIn
            </Link>
            <Link to="/contact">Contact</Link>
          </ul>
        </div>
      </footer>
    </HeadingLevelProvider>
  );
}

export default Footer;
