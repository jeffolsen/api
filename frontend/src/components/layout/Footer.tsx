import { HeadingLevelProvider } from "../common/Heading";

function Footer() {
  return (
    <HeadingLevelProvider>
      <footer className="footer bg-base-200 min-h-36"></footer>
    </HeadingLevelProvider>
  );
}

export default Footer;
