import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import JobSearchSection from "@/components/JobSearchSection";
import PlatformSection from "@/components/PlatformSection";
import DynamicActionSection from "@/components/DynamicActionSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <JobSearchSection />
      <PlatformSection />
      <DynamicActionSection />
      <Footer />
    </div>
  );
};

export default Index;
