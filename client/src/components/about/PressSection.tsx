export default function PressSection() {
  const pressReleases = [
    {
      title: "Unified Automation Hub Raises $30M Series B to Expand Enterprise Offerings",
      image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      source: "TechCrunch",
      date: "May 15, 2023",
      summary: "The company plans to use the funding to enhance its AI capabilities and expand its international presence."
    },
    {
      title: "How Unified Automation Hub is Transforming Healthcare Administration",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      source: "Forbes",
      date: "March 3, 2023",
      summary: "The platform's HIPAA-compliant automation tools are helping hospitals reduce administrative costs by up to 35%."
    },
    {
      title: "Small Businesses Embrace Automation to Combat Labor Shortages",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
      source: "Wall Street Journal",
      date: "January 20, 2023",
      summary: "Platforms like Unified Automation Hub are helping SMBs do more with fewer resources during challenging economic times."
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">In the News</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pressReleases.map((press, index) => (
            <a key={index} href="#" className="block group">
              <div className="bg-slate-50 rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition">
                <img 
                  src={press.image} 
                  alt="Press coverage" 
                  className="w-full h-48 object-cover" 
                />
                <div className="p-6">
                  <p className="text-sm text-slate-500 mb-2">{press.source} • {press.date}</p>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition">{press.title}</h3>
                  <p className="text-slate-600">{press.summary}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a href="#" className="bg-white border border-primary-500 text-primary-500 hover:bg-primary-50 font-semibold px-6 py-3 rounded-lg transition">
            View Press Room
          </a>
        </div>
      </div>
    </div>
  );
}
