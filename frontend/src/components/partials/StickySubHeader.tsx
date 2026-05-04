import clsx from "clsx";
import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { widestWidth } from "@/components/common/helpers/layoutStyles";

function StickySubHeader({ children }: PropsWithChildren) {
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
          "top-[82px] sm:top-[82px] mdtop-[86px] sticky z-20",
          !isAtTop && "shadow-xl",
        ])}
      >
        <div
          className={clsx([
            "bg-secondary text-secondary-content w-full transition-all duration-200",
            isAtTop ? ["mx-auto", widestWidth] : "max-w-full",
          ])}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export default StickySubHeader;
