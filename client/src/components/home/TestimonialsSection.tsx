import { Icons } from "@/lib/icons";

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CTO, TechNova Inc.",
      image: "https://randomuser.me/api/portraits/women/42.jpg",
      quote: "Unified Automation Hub has transformed how we handle customer data. We've reduced manual entry by 85% and virtually eliminated errors.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Operations Director, GrowthX",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      quote: "We've been able to automate our entire sales pipeline, saving our team over 20 hours per week and increasing conversion rates by 30%.",
      rating: 4.5
    },
    {
      name: "Aisha Patel",
      role: "Product Manager, HealthStream",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      quote: "The HIPAA compliance and security features give us peace of mind, while the automation capabilities have revolutionized our patient communication.",
      rating: 5
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Trusted by Industry Leaders</h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          See how companies across industries are transforming their operations with Unified Automation Hub.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition border border-slate-100">
            <div className="flex items-center mb-4">
              <img 
                src={testimonial.image} 
                alt={testimonial.name} 
                className="w-12 h-12 rounded-full mr-4" 
              />
              <div>
                <h4 className="font-semibold">{testimonial.name}</h4>
                <p className="text-sm text-slate-500">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-slate-700 mb-4">{testimonial.quote}</p>
            <div className="flex text-[#F59E0B]">
              {[...Array(Math.floor(testimonial.rating))].map((_, i) => (
                <Icons.star key={i} className="w-4 h-4" />
              ))}
              {testimonial.rating % 1 > 0 && (
                <Icons.starHalf className="w-4 h-4" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <a href="#" className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-6 py-3 rounded-lg shadow transition">
          Read Success Stories
        </a>
      </div>
    </div>
  );
}
