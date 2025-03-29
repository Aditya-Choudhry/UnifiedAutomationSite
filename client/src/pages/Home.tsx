import HeroSection from "@/components/home/HeroSection";
import Overview from "@/components/home/Overview";
import FeaturesSection from "@/components/home/FeaturesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import { useEffect } from "react";

export default function Home() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section id="home" className="pt-20 pb-10">
      <HeroSection />
      <Overview />
      <FeaturesSection />
      <TestimonialsSection />
    </section>
  );
}
