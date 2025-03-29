import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";

export default function Pricing() {
  return (
    <div className="bg-slate-50 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-slate-600">
            Choose the plan that works best for your automation needs. No hidden fees, no surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Starter Plan */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200 flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold">$29</span>
                <span className="text-slate-500 ml-2">/month</span>
              </div>
              <p className="text-slate-600 mb-4">Perfect for individuals and small businesses just getting started with automation.</p>
              <Button className="w-full">Start Free Trial</Button>
            </div>
            <div className="p-6 bg-slate-50 flex-grow">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Up to 5 workflows</span>
                </li>
                <li className="flex items-start">
                  <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>1,000 monthly tasks</span>
                </li>
                <li className="flex items-start">
                  <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Standard integrations</span>
                </li>
                <li className="flex items-start">
                  <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Email support</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Professional Plan */}
          <div className="bg-white rounded-lg shadow-xl overflow-hidden border-2 border-primary-500 flex flex-col relative">
            <div className="absolute top-0 right-0 bg-primary-500 text-white text-xs font-bold uppercase py-1 px-3 rounded-bl-lg">
              Most Popular
            </div>
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold mb-2">Professional</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold">$79</span>
                <span className="text-slate-500 ml-2">/month</span>
              </div>
              <p className="text-slate-600 mb-4">For growing teams that need more power and flexibility.</p>
              <Button className="w-full">Start Free Trial</Button>
            </div>
            <div className="p-6 bg-slate-50 flex-grow">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Unlimited workflows</span>
                </li>
                <li className="flex items-start">
                  <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>10,000 monthly tasks</span>
                </li>
                <li className="flex items-start">
                  <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Advanced integrations</span>
                </li>
                <li className="flex items-start">
                  <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Priority email & chat support</span>
                </li>
                <li className="flex items-start">
                  <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Webhook triggers</span>
                </li>
                <li className="flex items-start">
                  <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Advanced workflow analytics</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-200 flex flex-col">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold">$249</span>
                <span className="text-slate-500 ml-2">/month</span>
              </div>
              <p className="text-slate-600 mb-4">For organizations that need advanced security and custom solutions.</p>
              <Button className="w-full">Contact Sales</Button>
            </div>
            <div className="p-6 bg-slate-50 flex-grow">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Unlimited workflows</span>
                </li>
                <li className="flex items-start">
                  <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>100,000+ monthly tasks</span>
                </li>
                <li className="flex items-start">
                  <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Custom integrations</span>
                </li>
                <li className="flex items-start">
                  <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>24/7 dedicated support</span>
                </li>
                <li className="flex items-start">
                  <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Advanced security & compliance</span>
                </li>
                <li className="flex items-start">
                  <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Custom SLAs</span>
                </li>
                <li className="flex items-start">
                  <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>Dedicated account manager</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">Can I switch plans later?</h3>
              <p className="text-slate-600">Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">What happens if I exceed my monthly tasks?</h3>
              <p className="text-slate-600">If you exceed your monthly task limit, additional tasks will be billed at a per-task rate. We'll always notify you before you reach your limit.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">Do you offer a free tier?</h3>
              <p className="text-slate-600">Yes! We offer a limited free tier that includes 3 workflows and up to 100 tasks per month. It's perfect for testing out our platform.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">Is there a setup fee?</h3>
              <p className="text-slate-600">No, there are no setup fees on any of our plans. You only pay the advertised monthly price.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary-50 rounded-xl p-8 mt-16 max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Not sure which plan is right for you?</h2>
          <p className="text-slate-600 mb-6">Schedule a demo with our team to get a personalized recommendation.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="lg">
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}