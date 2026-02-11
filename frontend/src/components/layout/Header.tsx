import Heading, { HeadingLevelProvider } from "../common/Heading";

function Header() {
  return (
    <HeadingLevelProvider>
      <header className="navbar top-0 sticky bg-primary z-10">
        <Heading>Should be level 2</Heading>
      </header>
    </HeadingLevelProvider>
  );
}

export default Header;
