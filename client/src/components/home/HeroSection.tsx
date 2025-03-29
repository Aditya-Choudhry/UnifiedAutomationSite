import { Link } from "wouter";

export default function HeroSection() {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
      <div 
        className="absolute inset-0 opacity-20" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1470&auto=format&fit=crop')", 
          backgroundSize: "cover", 
          backgroundPosition: "center"
        }}
      ></div>
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Automate Your Workflow, Empower Your Business
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
            Connect your apps and automate workflows without writing code. Save time, reduce errors, and focus on what matters most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/work" className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105">
              Get Started Free
            </Link>
            <Link href="/demo" className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition">
              Try Demo <svg className="w-5 h-5 ml-2 inline" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
            </Link>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-6">
            {/* Partner logos - Using SVG instead of images */}
            <svg className="h-8 opacity-70 hover:opacity-100 transition" viewBox="0 0 120 40" fill="currentColor">
              <rect width="120" height="40" fill="none" />
              <text x="10" y="25" fontFamily="Arial" fontSize="12" fill="white">Partner 1</text>
            </svg>
            <svg className="h-8 opacity-70 hover:opacity-100 transition" viewBox="0 0 120 40" fill="currentColor">
              <rect width="120" height="40" fill="none" />
              <text x="10" y="25" fontFamily="Arial" fontSize="12" fill="white">Partner 2</text>
            </svg>
            <svg className="h-8 opacity-70 hover:opacity-100 transition" viewBox="0 0 120 40" fill="currentColor">
              <rect width="120" height="40" fill="none" />
              <text x="10" y="25" fontFamily="Arial" fontSize="12" fill="white">Partner 3</text>
            </svg>
            <svg className="h-8 opacity-70 hover:opacity-100 transition" viewBox="0 0 120 40" fill="currentColor">
              <rect width="120" height="40" fill="none" />
              <text x="10" y="25" fontFamily="Arial" fontSize="12" fill="white">Partner 4</text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
