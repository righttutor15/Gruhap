import { motion } from "framer-motion";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <motion.div
            className="w-16 h-16 rounded-2xl bg-cta flex items-center justify-center"
            animate={{
              rotate: [0, 90, 180, 270, 360],
              borderRadius: ["20%", "50%", "20%"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-cta-foreground font-display font-bold text-2xl">G</span>
          </motion.div>
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-cta"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
        <motion.p
          className="text-foreground/60 font-display font-medium tracking-widest text-xs uppercase"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading Gruhap...
        </motion.p>
      </div>
    </div>
  );
};

export default PageLoader;
