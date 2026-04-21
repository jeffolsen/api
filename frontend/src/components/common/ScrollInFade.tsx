import { motion } from "motion/react";
import { PropsWithChildren } from "react";

type ScrollInFadeProps = {
  className?: string;
  critical?: boolean;
};

export default function ScrollInFade({
  className,
  critical,
  children,
}: PropsWithChildren<ScrollInFadeProps>) {
  if (critical) return <div className={className}>{children}</div>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Start hidden and slightly down
      whileInView={{ opacity: 1, y: 0 }} // Fade in and move up to original position
      viewport={{ once: true, amount: 0.5 }} // Only animate once, when 50% visible
      transition={{ duration: 0.8 }} // Smooth animation
      className={className}
    >
      {children}
    </motion.div>
  );
}
