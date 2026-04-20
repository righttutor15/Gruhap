import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AITutorsSection from "@/components/AITutorsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AITutorsSection />
      <TestimonialsSection />
      <CommunitySection />
      <Footer />
    </div>
  );
};

export default Index;
