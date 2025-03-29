import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const EnterprisePricing = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="border border-slate-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl mb-2">Enterprise Custom Pricing</CardTitle>
              <CardDescription>
                Tailored solutions for organizations with complex needs
              </CardDescription>
            </div>
            <Badge variant="outline" className="bg-primary-50 text-primary-700 border-primary-200">
              Custom Quote
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <ul className="space-y-3">
            <li className="flex items-start">
              <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <span className="font-medium">Unlimited workflows & users</span>
                <p className="text-sm text-slate-500">Scale without limits across your entire organization</p>
              </div>
            </li>
            <li className="flex items-start">
              <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <span className="font-medium">Custom integration development</span>
                <p className="text-sm text-slate-500">We'll build connections to your proprietary systems</p>
              </div>
            </li>
            <li className="flex items-start">
              <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <span className="font-medium">Dedicated account manager</span>
                <p className="text-sm text-slate-500">Direct line to your personal success manager</p>
              </div>
            </li>
            <li className="flex items-start">
              <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <span className="font-medium">Custom SLA guarantee</span>
                <p className="text-sm text-slate-500">Tailored service level agreement to meet your requirements</p>
              </div>
            </li>
            <li className="flex items-start">
              <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <span className="font-medium">On-premises deployment option</span>
                <p className="text-sm text-slate-500">Deploy within your own infrastructure for maximum control</p>
              </div>
            </li>
            <li className="flex items-start">
              <Icons.check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <div>
                <span className="font-medium">Custom training & onboarding</span>
                <p className="text-sm text-slate-500">Personalized training sessions for your team</p>
              </div>
            </li>
          </ul>

          <div className="bg-slate-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Enterprise customers also get:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <Icons.shield className="h-4 w-4 text-primary-500 mr-2" />
                <span>SOC 2, HIPAA, GDPR compliance</span>
              </div>
              <div className="flex items-center">
                <Icons.users className="h-4 w-4 text-primary-500 mr-2" />
                <span>Unlimited team workspaces</span>
              </div>
              <div className="flex items-center">
                <Icons.shield className="h-4 w-4 text-primary-500 mr-2" />
                <span>Custom encryption keys</span>
              </div>
              <div className="flex items-center">
                <Icons.chat className="h-4 w-4 text-primary-500 mr-2" />
                <span>24/7 priority support</span>
              </div>
            </div>
          </div>

          <Button size="lg" className="w-full">
            <Icons.clock className="mr-2 h-4 w-4" /> Schedule Enterprise Demo
          </Button>
        </CardContent>
      </Card>

      <Card className="border border-slate-200 bg-slate-50">
        <CardHeader>
          <CardTitle className="text-xl">Contact Our Sales Team</CardTitle>
          <CardDescription>
            Tell us about your needs and we'll prepare a custom quote for you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
              <Input id="name" placeholder="John Smith" />
            </div>
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium">Company</label>
              <Input id="company" placeholder="Acme Corp" />
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Work Email</label>
              <Input id="email" type="email" placeholder="john@company.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">Phone</label>
              <Input id="phone" placeholder="+1 (555) 123-4567" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="workflows" className="text-sm font-medium">Estimated Number of Workflows</label>
            <Input id="workflows" placeholder="e.g., 50" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="team-size" className="text-sm font-medium">Team Size</label>
            <Input id="team-size" placeholder="e.g., 100" />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="requirements" className="text-sm font-medium">Specific Requirements</label>
            <Textarea 
              id="requirements" 
              placeholder="Tell us about your automation needs, integrations required, etc." 
              rows={4}
            />
          </div>
          
          <Button className="w-full">
            <Icons.send className="mr-2 h-4 w-4" /> Submit Request
          </Button>
          
          <p className="text-xs text-center text-slate-500">
            We'll get back to you within 1 business day. Your information will never be shared with third parties.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnterprisePricing;