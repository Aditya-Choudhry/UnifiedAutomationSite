import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Icons } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface NavbarProps {
  popupVisible: boolean;
}

export default function Navbar({ popupVisible }: NavbarProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when clicking a link
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header 
      className={cn(
        "bg-white shadow-sm sticky z-40 transition-all duration-200",
        popupVisible ? "top-[40px]" : "top-0",
        scrolled ? "shadow-md" : "shadow-sm"
      )}
    >
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-500 rounded-md flex items-center justify-center">
            <Icons.robot className="text-white text-xl" />
          </div>
          <span className="text-lg font-semibold hidden sm:inline">Unified Automation Hub</span>
          <span className="text-lg font-semibold sm:hidden">UAH</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className={`font-medium ${location === '/' ? 'text-slate-900' : 'text-slate-600'} hover:text-primary-500 transition`}>
            Home
          </Link>
          <Link href="/about" className={`font-medium ${location === '/about' ? 'text-slate-900' : 'text-slate-600'} hover:text-primary-500 transition`}>
            About
          </Link>
          <Link href="/work" className={`font-medium ${location === '/work' ? 'text-slate-900' : 'text-slate-600'} hover:text-primary-500 transition`}>
            Work
          </Link>
          <Link href="/pricing" className={`font-medium ${location === '/pricing' ? 'text-slate-900' : 'text-slate-600'} hover:text-primary-500 transition`}>
            Pricing
          </Link>
          <Link href="/demo" className={`font-medium ${location === '/demo' ? 'text-slate-900' : 'text-slate-600'} hover:text-primary-500 transition`}>
            Demo
          </Link>
        </nav>
        
        <div className="flex items-center space-x-3">
          <a href="#" className="hidden md:inline-block text-slate-600 hover:text-primary-500 px-3 py-2 rounded-md transition font-medium">Sign In</a>
          <a href="#" className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-md transition font-medium shadow-sm">Get Started</a>
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-slate-500 hover:text-slate-700"
            aria-label="Toggle mobile menu"
          >
            <Icons.menu className="text-xl w-6 h-6" />
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'} bg-white border-t border-slate-100 shadow-sm`}>
        <div className="container mx-auto px-4 py-2 space-y-2">
          <Link href="/" onClick={closeMobileMenu} className="block py-2 text-slate-600 hover:text-primary-500 font-medium">Home</Link>
          <Link href="/about" onClick={closeMobileMenu} className="block py-2 text-slate-600 hover:text-primary-500 font-medium">About</Link>
          <Link href="/work" onClick={closeMobileMenu} className="block py-2 text-slate-600 hover:text-primary-500 font-medium">Work</Link>
          <Link href="/pricing" onClick={closeMobileMenu} className="block py-2 text-slate-600 hover:text-primary-500 font-medium">Pricing</Link>
          <Link href="/demo" onClick={closeMobileMenu} className="block py-2 text-slate-600 hover:text-primary-500 font-medium">Demo</Link>
          <a href="#" className="block py-2 text-slate-600 hover:text-primary-500 font-medium">Sign In</a>
        </div>
      </div>
    </header>
  );
}
