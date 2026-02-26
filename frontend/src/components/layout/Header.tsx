import { HeadingLevelProvider } from "../common/Heading";

function Header() {
  return (
    <HeadingLevelProvider>
      <header className="navbar top-0 sticky bg-neutral z-10"></header>
    </HeadingLevelProvider>
  );
}

export default Header;
