import WorkflowDashboard from "@/components/work/WorkflowDashboard";
import WorkflowBuilder from "@/components/work/WorkflowBuilder";
import MonitoringSection from "@/components/work/MonitoringSection";
import { useEffect } from "react";

export default function Work() {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section id="work" className="pt-20 pb-16">
      <WorkflowDashboard />
      <WorkflowBuilder />
      <MonitoringSection />
    </section>
  );
}
