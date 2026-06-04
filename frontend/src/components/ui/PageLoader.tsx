import { motion } from "framer-motion";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-foreground flex items-center justify-center shadow-lg">
          <span className="text-background font-display font-bold text-2xl">G</span>
        </div>
        <span className="font-display font-bold text-3xl tracking-tight text-foreground">Gruhap</span>
      </div>

      <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden relative">
        <motion.div
          className="absolute left-0 top-0 bottom-0 bg-primary rounded-full"
          initial={{ width: "0%", left: "0%" }}
          animate={{ width: ["0%", "50%", "100%", "100%"], left: ["0%", "0%", "100%", "100%"] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default PageLoader;
