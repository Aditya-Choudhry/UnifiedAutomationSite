export default function AboutHero() {
  return (
    <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">Our Mission</h1>
        <p className="text-xl text-slate-600 leading-relaxed">
          At Unified Automation Hub, we're on a mission to democratize automation. We believe that powerful workflow automation should be accessible to everyone, not just developers and engineers.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Transforming Business Through Automation</h2>
          <p className="text-slate-600 mb-6">
            Founded in 2018, Unified Automation Hub began with a simple idea: what if anyone could create powerful automations without writing code? Today, we're helping thousands of businesses save time, reduce errors, and focus on what matters most.
          </p>
          <p className="text-slate-600">
            Our platform connects over 200 apps and services, enabling seamless workflows across departments and organizations of all sizes.
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <img 
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
            alt="Team working together" 
            className="rounded-md w-full" 
          />
        </div>
      </div>
    </div>
  );
}
