import clsx from "clsx";
import BreadCrumbs from "../layout/BreadCrumbs";
import { useEffect, useRef, useState } from "react";

function StickySubHeader() {
  const [isAtTop, setIsAtTop] = useState<boolean>(true);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // isIntersecting is true when the sentinel is visible (at top)
        setIsAtTop(entry.isIntersecting);
      },
      { threshold: 0 }, // Trigger as soon as 1px is visible/hidden
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} style={{ height: "1px", marginBottom: "-1px" }} />
      <div
        className={clsx([
          "bg-base-300",
          "top-[64px] sm:top-[82px] mdtop-[86px] sticky z-20",
          !isAtTop && "shadow-xl",
        ])}
      >
        <div
          className={clsx([
            "bg-secondary text-secondary-content w-full transition-all duration-200",
            isAtTop ? "mx-auto max-w-screen-2xl" : "max-w-full",
          ])}
        >
          <BreadCrumbs />
        </div>
      </div>
      {/* Rest of your page */}
    </>
  );
}

export default StickySubHeader;
