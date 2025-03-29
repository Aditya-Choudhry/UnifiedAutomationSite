import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Work from "@/pages/Work";
import Pricing from "@/pages/Pricing";
import Demo from "@/pages/Demo";
import PopupBar from "@/components/PopupBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

function Router() {
  // Add header offset for smooth scrolling based on whether popup is visible
  const [popupVisible, setPopupVisible] = useState(true);

  return (
    <div className="flex flex-col min-h-screen font-sans text-slate-800 bg-slate-50">
      <PopupBar isVisible={popupVisible} setIsVisible={setPopupVisible} />
      <Navbar popupVisible={popupVisible} />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/work" component={Work} />
          <Route path="/pricing" component={Pricing} />
          <Route path="/demo" component={Demo} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
