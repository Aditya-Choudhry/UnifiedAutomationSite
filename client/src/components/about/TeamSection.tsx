import { Icons } from "@/lib/icons";

export default function TeamSection() {
  const teamMembers = [
    {
      name: "David Wilson",
      role: "Co-Founder & CEO",
      image: "https://randomuser.me/api/portraits/men/41.jpg",
      bio: "Former engineering lead at Salesforce with 15+ years in enterprise software.",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Jennifer Zhao",
      role: "Co-Founder & CTO",
      image: "https://randomuser.me/api/portraits/women/41.jpg",
      bio: "AI/ML specialist with previous roles at Google and Microsoft.",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    },
    {
      name: "Marcus Johnson",
      role: "Chief Product Officer",
      image: "https://randomuser.me/api/portraits/men/29.jpg",
      bio: "Product leadership experience at Asana and Slack.",
      social: {
        linkedin: "#",
        twitter: "#"
      }
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Leadership Team</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="text-center">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-24 h-24 rounded-full mx-auto mb-4" 
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-slate-500 mb-2">{member.role}</p>
              <p className="text-slate-600 mb-4 text-sm">{member.bio}</p>
              <div className="flex justify-center space-x-3">
                <a href={member.social.linkedin} className="text-slate-400 hover:text-primary-500">
                  <Icons.linkedin className="w-5 h-5" />
                </a>
                <a href={member.social.twitter} className="text-slate-400 hover:text-primary-500">
                  <Icons.twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <a href="#" className="inline-flex items-center font-medium text-primary-600 hover:text-primary-700">
            View full team <Icons.chevronRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
