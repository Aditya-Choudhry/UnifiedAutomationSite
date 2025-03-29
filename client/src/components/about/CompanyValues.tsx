import { Icons } from "@/lib/icons";

export default function CompanyValues() {
  const values = [
    {
      icon: <Icons.users className="text-primary-500" />,
      title: "Customer First",
      description: "We put our customers at the center of everything we do, building solutions that solve real problems.",
      bgColor: "bg-primary-50"
    },
    {
      icon: <Icons.lightbulb className="text-[#10B981]" />,
      title: "Innovation",
      description: "We're constantly pushing boundaries to create automation solutions that are both powerful and easy to use.",
      bgColor: "bg-green-50"
    },
    {
      icon: <Icons.shield className="text-[#F59E0B]" />,
      title: "Trust & Security",
      description: "We maintain the highest standards of security and reliability, earning our customers' trust every day.",
      bgColor: "bg-amber-50"
    },
    {
      icon: <Icons.globe className="text-primary-500" />,
      title: "Inclusivity",
      description: "We build for everyone, ensuring our platform is accessible and valuable regardless of technical expertise.",
      bgColor: "bg-blue-50"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {values.map((value, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
            <div className={`w-12 h-12 ${value.bgColor} rounded-full flex items-center justify-center mb-4`}>
              {value.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
            <p className="text-slate-600">{value.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
