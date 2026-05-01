import {
  useScroll,
  useTransform,
  useMotionTemplate,
  motion,
} from "motion/react";
import bgPattern from "@/assets/cubes.png";

function ContentBackground() {
  // scrollY is a MotionValue — a live number that updates on scroll without
  // triggering a React re-render. Think of it as a reactive ref.
  const { scrollY } = useScroll();

  // useTransform maps one MotionValue to another using an input/output range.
  // Here: as scrollY goes from 0 → 2000px, backgroundPositionY goes from 0 → -300px.
  // The negative direction moves the pattern upward while the page scrolls down,
  // which creates the sense that the background is further away (parallax depth).
  // Adjust the -300 to control intensity — smaller = subtler effect.
  const backgroundPositionY = useTransform(scrollY, [0, 2000], [0, -500]);
  const backgroundSizeX = useTransform(scrollY, [0, 2000], [300, 280]);

  // useMotionTemplate builds a reactive CSS string from MotionValues.
  // Whenever backgroundPositionY changes, this string updates automatically.
  // The result is equivalent to `backgroundPosition: "center 0px"` at the top,
  // sliding to `backgroundPosition: "center -300px"` after 2000px of scroll.
  const backgroundPosition = useMotionTemplate`center ${backgroundPositionY}px`;
  const backgroundSize = useMotionTemplate`${backgroundSizeX}px`;

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
        }}
        className="bg-repeat fixed inset-0 -z-10 brightness-[0.4] blur-[2px]"
      />
      <div className="fixed inset-0 -z-10 h-screen w-screen bg-gradient-to-t from-base-100/50 via-base-300 to-base-300" />
    </>
  );
}

export default ContentBackground;
