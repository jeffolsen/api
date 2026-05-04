import {
  useScroll,
  useTransform,
  useMotionTemplate,
  motion,
} from "motion/react";
import bgPattern from "@/assets/images/cubes.png";
import clsx from "clsx";
import { widestWidth } from "../common/helpers/layoutStyles";

function ContentBackground() {
  // scrollY is a MotionValue — a live number that updates on scroll without
  // triggering a React re-render. Think of it as a reactive ref.
  const { scrollY } = useScroll();

  // useTransform maps one MotionValue to another using an input/output range.
  // Here: as scrollY goes from 0 → 2000px, backgroundPositionY goes from 0 → -300px.
  // The negative direction moves the pattern upward while the page scrolls down,
  // which creates the sense that the background is further away (parallax depth).
  // Adjust the -300 to control intensity — smaller = subtler effect.
  const backgroundPositionY = useTransform(scrollY, [0, 4000], [0, -800]);
  const backgroundSizeX = useTransform(scrollY, [0, 2000], [280, 240]);
  const blur = useTransform(scrollY, [0, 2000], [1, 2]);

  // useMotionTemplate builds a reactive CSS string from MotionValues.
  // Whenever backgroundPositionY changes, this string updates automatically.
  // The result is equivalent to `backgroundPosition: "center 0px"` at the top,
  // sliding to `backgroundPosition: "center -300px"` after 2000px of scroll.
  const backgroundPosition = useMotionTemplate`center ${backgroundPositionY}px`;
  const backgroundSize = useMotionTemplate`${backgroundSizeX}px`;
  const filter = useMotionTemplate`brightness(0.4) blur(${blur}px)`;

  return (
    <>
      {/* motion.div is just a regular div that accepts MotionValues in its style prop.
          Passing backgroundPosition here wires the scroll-driven value directly into
          the element's style — no re-renders, no requestAnimationFrame needed. */}
      <motion.div
        style={{
          backgroundImage: `url(${bgPattern})`,
          backgroundSize,
          backgroundPosition,
          filter,
        }}
        className={clsx(["bg-repeat fixed inset-0 -z-10 mx-auto", widestWidth])}
      />
      <div
        className={clsx([
          "fixed inset-0 -z-10 h-screen w-screen",
          widestWidth,
          "bg-gradient-to-t from-base-100/50 via-base-300 to-base-300 mx-auto",
        ])}
      />
    </>
  );
}

export default ContentBackground;
