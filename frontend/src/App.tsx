import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { pageTransition } from "./lib/motion";
import ScrollToTop from "./components/ScrollToTop";
import PageLoader from "./components/ui/PageLoader";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const AITutors = lazy(() => import("./pages/AITutors"));
const Community = lazy(() => import("./pages/Community"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const OurServices = lazy(() => import("./pages/OurServices"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Login = lazy(() => import("./pages/Login"));
const GetStarted = lazy(() => import("./pages/GetStarted"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/our-services" element={<OurServices />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/ai-tutors" element={<AITutors />} />
          <Route path="/community" element={<Community />} />
          <Route path="/login" element={<Login />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <AnimatedRoutes />
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
