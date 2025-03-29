import { Icons } from "@/lib/icons";

export default function Overview() {
  const benefits = [
    {
      title: "Real-time synchronization",
      description: "Keep your systems in sync with bidirectional data flows that update in real-time"
    },
    {
      title: "No-code builder",
      description: "Create complex workflows with our intuitive drag-and-drop interface - no coding required"
    },
    {
      title: "Enterprise-grade security",
      description: "Your data is protected with end-to-end encryption and compliant with industry standards"
    },
    {
      title: "Unlimited scalability",
      description: "From startups to enterprises, our platform scales with your business needs"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Workflow Automation Made Simple</h2>
          <p className="text-lg text-slate-600">
            Unified Automation Hub connects the tools you use every day, automating repetitive tasks and ensuring your data flows seamlessly across your organization.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-xl font-semibold mb-4">Connect, Automate, and Scale</h3>
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <div className="mr-4 mt-1 bg-primary-50 rounded-full p-1">
                    <Icons.check className="h-4 w-4 text-primary-500" />
                  </div>
                  <div>
                    <h4 className="font-medium">{benefit.title}</h4>
                    <p className="text-slate-600">{benefit.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-100 p-6 rounded-lg shadow-inner">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1470" 
              alt="Automation Platform Interface" 
              className="rounded-md shadow-sm" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
