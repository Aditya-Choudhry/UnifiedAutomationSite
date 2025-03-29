import AboutHero from "@/components/about/AboutHero";
import CompanyValues from "@/components/about/CompanyValues";
import TeamSection from "@/components/about/TeamSection";
import CompanyTimeline from "@/components/about/CompanyTimeline";
import PressSection from "@/components/about/PressSection";
import { useEffect } from "react";

export default function About() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section id="about" className="pt-20 pb-16 bg-slate-50">
      <AboutHero />
      <CompanyValues />
      <TeamSection />
      <CompanyTimeline />
      <PressSection />
    </section>
  );
}
