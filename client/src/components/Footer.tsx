import { Link } from "wouter";
import { Icons } from "@/lib/icons";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-md flex items-center justify-center">
                <Icons.robot className="text-white text-xl" />
              </div>
              <span className="text-xl font-semibold">Unified Automation Hub</span>
            </Link>
            <p className="text-slate-300 mb-6">
              Automate your workflow, empower your business with our no-code automation platform that connects all your favorite apps.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-300 hover:text-white transition">
                <Icons.twitter className="text-xl w-5 h-5" />
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition">
                <Icons.linkedin className="text-xl w-5 h-5" />
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition">
                <Icons.facebook className="text-xl w-5 h-5" />
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition">
                <Icons.github className="text-xl w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-white transition">Features</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition">Integrations</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition">Pricing</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition">Changelog</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition">Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-slate-300 hover:text-white transition">About Us</Link></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition">Careers</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition">Blog</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition">Press</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-slate-300 hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition">Terms of Service</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition">Security</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition">GDPR Compliance</a></li>
              <li><a href="#" className="text-slate-300 hover:text-white transition">HIPAA Compliance</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 mb-4 md:mb-0">© 2023 Unified Automation Hub. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-400 hover:text-white transition text-sm">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-white transition text-sm">Terms</a>
            <a href="#" className="text-slate-400 hover:text-white transition text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
