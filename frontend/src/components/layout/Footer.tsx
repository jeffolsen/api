import Heading, { HeadingLevelProvider } from "../common/Heading";

function Footer() {
  return (
    <HeadingLevelProvider>
      <footer className="footer bg-secondary min-h-36">
        <Heading>Should be level 2</Heading>
      </footer>
    </HeadingLevelProvider>
  );
}

export default Footer;
