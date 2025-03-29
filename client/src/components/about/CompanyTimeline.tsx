export default function CompanyTimeline() {
  const timelineEvents = [
    {
      year: "2018",
      title: "Company Founded",
      description: "David and Jennifer launch Unified Automation Hub with seed funding."
    },
    {
      year: "2019",
      title: "Series A Funding",
      description: "Raised $12M to expand the platform and grow the team."
    },
    {
      year: "2020",
      title: "100+ Integrations",
      description: "Platform reaches a major milestone with over 100 app integrations."
    },
    {
      year: "2021",
      title: "Enterprise Launch",
      description: "Released enterprise-grade features and security certifications."
    },
    {
      year: "2023",
      title: "200+ Integrations",
      description: "Platform continues to grow with 200+ integrations and 10,000+ customers.",
      highlight: true
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
      
      <div className="max-w-4xl mx-auto relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-slate-200"></div>
        
        {timelineEvents.map((event, index) => (
          <div key={index} className="relative mb-12">
            <div className="flex items-center mb-4">
              <div className={`${event.highlight ? 'bg-[#F59E0B]' : 'bg-primary-500'} w-4 h-4 rounded-full absolute left-1/2 transform -translate-x-1/2 z-10`}></div>
              <div className="w-1/2 pr-8 text-right">
                <h3 className="font-semibold text-lg">{event.year}</h3>
              </div>
              <div className="w-1/2 pl-8">
                <h4 className="font-semibold">{event.title}</h4>
                <p className="text-slate-600">{event.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
