import { lazy, Suspense } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";

// Lazy load sections below the fold
const AITutorsSection = lazy(() => import("@/components/AITutorsSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const CommunitySection = lazy(() => import("@/components/CommunitySection"));

const SectionLoader = () => (
  <div className="w-full h-96 flex items-center justify-center bg-background/50 animate-pulse rounded-3xl">
    <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      
      <Suspense fallback={<SectionLoader />}>
        <AITutorsSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <TestimonialsSection />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <CommunitySection />
      </Suspense>

      <Footer />
    </div>
  );
};

export default Index;
