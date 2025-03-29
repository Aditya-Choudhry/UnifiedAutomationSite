import { Icons } from "@/lib/icons";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Icons.puzzle className="text-xl text-primary-500" />,
      title: "Drag-and-Drop Builder",
      description: "Create custom workflows with a simple, intuitive interface that anyone can use.",
      bgColor: "bg-primary-50"
    },
    {
      icon: <Icons.bolt className="text-xl text-[#10B981]" />,
      title: "200+ Integrations",
      description: "Connect with all your favorite tools and services through our extensive library.",
      bgColor: "bg-green-50"
    },
    {
      icon: <Icons.shield className="text-xl text-primary-500" />,
      title: "Enterprise Security",
      description: "Advanced encryption and compliance with SOC 2, GDPR, HIPAA, and more.",
      bgColor: "bg-blue-50"
    },
    {
      icon: <Icons.chart className="text-xl text-[#F59E0B]" />,
      title: "Real-Time Analytics",
      description: "Monitor performance and get insights to optimize your workflows.",
      bgColor: "bg-amber-50"
    }
  ];

  return (
    <div className="bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Features to Transform Your Workflow</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Everything you need to automate your business processes and connect your favorite apps.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border border-slate-100">
              <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-600">{feature.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a href="#" className="inline-flex items-center font-medium text-primary-600 hover:text-primary-700">
            View all features <Icons.chevronRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
