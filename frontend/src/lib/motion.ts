import type { Variants, Transition } from "framer-motion";

/* ─── Timing presets ─── */
const spring = { type: "spring", stiffness: 260, damping: 20 } as const satisfies Transition;
const snappy = { type: "spring", stiffness: 400, damping: 25 } as const satisfies Transition;
const smooth = { duration: 0.35, ease: "easeOut" as const };

/* ─── Hover & tap (use with whileHover / whileTap) ─── */
export const hoverPop = { scale: 1.05, transition: snappy };
export const hoverLift = { y: -4, transition: smooth };
export const tapShrink = { scale: 0.96, transition: snappy };

/* ─── Scroll-reveal variants (use with initial/whileInView) ─── */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { ...smooth, duration: 0.5 } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: smooth },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { ...spring } },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: { opacity: 1, x: 0, transition: smooth },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: smooth },
};

/* ─── Stagger container ─── */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

/* ─── Page transition ─── */
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: "easeIn" as const } },
};

/* ─── Shared viewport config ─── */
export const viewportOnce = { once: true, margin: "-60px" as const };
