import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Icons } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Detailed feature list with categories
const features = {
  'Core Platform': [
    {
      name: 'Active workflows',
      tooltip: 'The number of automation workflows that can be active at the same time',
      starter: '5',
      professional: '25',
      enterprise: 'Unlimited'
    },
    {
      name: 'Monthly workflow runs',
      tooltip: 'The total number of times your workflows can run each month',
      starter: '1,000',
      professional: '25,000',
      enterprise: 'Unlimited'
    },
    {
      name: 'User accounts',
      tooltip: 'Total number of team members who can access your account',
      starter: '3',
      professional: '15',
      enterprise: 'Unlimited'
    },
    {
      name: 'Storage space',
      tooltip: 'Available storage for files, data, and workflow history',
      starter: '1 GB',
      professional: '20 GB',
      enterprise: '1 TB'
    }
  ],
  'Workflow Builder': [
    {
      name: 'Visual workflow editor',
      tooltip: 'Drag-and-drop interface for building workflows',
      starter: true,
      professional: true,
      enterprise: true
    },
    {
      name: 'Workflow templates',
      tooltip: 'Pre-built workflow templates for common automation scenarios',
      starter: '10 templates',
      professional: '50+ templates',
      enterprise: 'All templates + custom'
    },
    {
      name: 'Conditional logic',
      tooltip: 'Add if/then conditions to create branching workflows',
      starter: 'Basic',
      professional: 'Advanced',
      enterprise: 'Advanced + custom expressions'
    },
    {
      name: 'Error handling',
      tooltip: 'Tools to handle and recover from errors in workflows',
      starter: 'Basic',
      professional: 'Advanced',
      enterprise: 'Custom error strategies'
    },
    {
      name: 'Version control',
      tooltip: 'Track changes to workflows and rollback when needed',
      starter: false,
      professional: true,
      enterprise: true
    },
    {
      name: 'Workflow testing',
      tooltip: 'Test workflows before deploying them to production',
      starter: 'Manual tests',
      professional: 'Automated tests',
      enterprise: 'Comprehensive test suite'
    }
  ],
  'Integrations & Connectivity': [
    {
      name: 'Pre-built app integrations',
      tooltip: 'Connect to popular third-party applications',
      starter: '25+ apps',
      professional: '100+ apps',
      enterprise: '250+ apps'
    },
    {
      name: 'Custom API integrations',
      tooltip: 'Connect to any system with a REST API',
      starter: 'Basic HTTP',
      professional: 'Advanced with auth',
      enterprise: 'Full custom + webhooks'
    },
    {
      name: 'Database connectors',
      tooltip: 'Connect directly to databases',
      starter: false,
      professional: 'Popular DBs only',
      enterprise: 'All databases'
    },
    {
      name: 'Custom connector development',
      tooltip: 'We build connectors for your specific systems',
      starter: false,
      professional: false,
      enterprise: true
    },
    {
      name: 'Developer API',
      tooltip: 'Programmatically create and manage workflows',
      starter: 'Read-only',
      professional: 'Full API access',
      enterprise: 'Enterprise API with higher limits'
    }
  ],
  'Security & Compliance': [
    {
      name: 'SSO authentication',
      tooltip: 'Single sign-on with your identity provider',
      starter: false,
      professional: true,
      enterprise: true
    },
    {
      name: 'Role-based access control',
      tooltip: 'Control who can view, edit, or execute workflows',
      starter: 'Basic roles',
      professional: 'Advanced roles',
      enterprise: 'Custom roles & permissions'
    },
    {
      name: 'Audit logs',
      tooltip: 'Track all changes and actions within the platform',
      starter: '7 days',
      professional: '30 days',
      enterprise: '1 year + custom retention'
    },
    {
      name: 'Data encryption',
      tooltip: 'Protect sensitive data at rest and in transit',
      starter: 'Standard encryption',
      professional: 'Enhanced encryption',
      enterprise: 'Custom encryption keys'
    },
    {
      name: 'Compliance certifications',
      tooltip: 'Platform compliance with regulations',
      starter: 'SOC 2',
      professional: 'SOC 2, GDPR',
      enterprise: 'SOC 2, GDPR, HIPAA, PCI, more'
    }
  ],
  'Support & Success': [
    {
      name: 'Support channels',
      tooltip: 'Ways to get help when you need it',
      starter: 'Email, Community',
      professional: 'Email, Chat, Phone',
      enterprise: 'Dedicated support team'
    },
    {
      name: 'Response time',
      tooltip: 'How quickly we respond to support requests',
      starter: '24 hours',
      professional: '4 hours',
      enterprise: '1 hour SLA'
    },
    {
      name: 'Onboarding assistance',
      tooltip: 'Help getting started with the platform',
      starter: 'Self-serve',
      professional: 'Guided setup',
      enterprise: 'White-glove onboarding'
    },
    {
      name: 'Training resources',
      tooltip: 'Learning materials to master the platform',
      starter: 'Documentation, videos',
      professional: 'All starter + webinars',
      enterprise: 'Custom training sessions'
    },
    {
      name: 'Success manager',
      tooltip: 'Dedicated contact to ensure your success',
      starter: false,
      professional: 'Shared success team',
      enterprise: 'Dedicated manager'
    }
  ]
};

const FeatureComparison = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Core Platform']);
  
  const toggleCategory = (category: string) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter(c => c !== category));
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
  };
  
  const handleCategorySelect = (category: string) => {
    setActiveCategory(category);
    if (category !== 'all' && !expandedCategories.includes(category)) {
      setExpandedCategories([...expandedCategories, category]);
    }
  };
  
  // Filter features by category
  const getFeaturesToShow = () => {
    if (activeCategory === 'all') {
      return features;
    }
    
    return {
      [activeCategory]: features[activeCategory as keyof typeof features]
    };
  };
  
  const featuresToShow = getFeaturesToShow();
  
  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-10 bg-white pb-4">
        <h2 className="text-2xl font-bold mb-4">Feature Comparison</h2>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={handleCategorySelect}>
          <TabsList className="mb-2 flex flex-wrap h-auto p-1">
            <TabsTrigger value="all">All Features</TabsTrigger>
            {Object.keys(features).map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[300px]">Feature</TableHead>
              <TableHead>
                <div className="text-center">
                  <div className="font-bold">Starter</div>
                  <div className="text-sm font-normal text-slate-500">$29/month</div>
                </div>
              </TableHead>
              <TableHead>
                <div className="text-center">
                  <div className="font-bold text-primary-600">Professional</div>
                  <div className="text-sm font-normal text-slate-500">$99/month</div>
                  <Badge className="mt-1 bg-primary-100 text-primary-700 border-primary-200">Most Popular</Badge>
                </div>
              </TableHead>
              <TableHead>
                <div className="text-center">
                  <div className="font-bold">Enterprise</div>
                  <div className="text-sm font-normal text-slate-500">Custom pricing</div>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(featuresToShow).map(([category, categoryFeatures]) => (
              <React.Fragment key={category}>
                <TableRow className="bg-slate-100 hover:bg-slate-100">
                  <TableCell colSpan={4} className="py-2">
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto font-semibold"
                      onClick={() => toggleCategory(category)}
                    >
                      <Icons.chevronDown 
                        className={`h-5 w-5 mr-1 transition-transform ${expandedCategories.includes(category) ? 'rotate-0' : '-rotate-90'}`} 
                      />
                      {category}
                    </Button>
                  </TableCell>
                </TableRow>
                
                {expandedCategories.includes(category) && categoryFeatures.map((feature, index) => (
                  <TableRow key={`${category}-${index}`} className="hover:bg-slate-50">
                    <TableCell className="font-medium">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center">
                              {feature.name}
                              <Icons.info className="h-4 w-4 ml-1 text-slate-400" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{feature.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-center">
                      {renderFeatureValue(feature.starter)}
                    </TableCell>
                    <TableCell className="text-center">
                      {renderFeatureValue(feature.professional)}
                    </TableCell>
                    <TableCell className="text-center">
                      {renderFeatureValue(feature.enterprise)}
                    </TableCell>
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="text-center mt-6 space-y-4">
        <p className="text-slate-600">
          Need more details on specific features? Check our <a href="#" className="text-primary-600 hover:underline">detailed documentation</a> or <a href="#" className="text-primary-600 hover:underline">contact sales</a>.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="outline">
            <Icons.file className="mr-2 h-4 w-4" /> Download Full Comparison
          </Button>
          <Button>
            <Icons.clock className="mr-2 h-4 w-4" /> Schedule Demo
          </Button>
        </div>
      </div>
      
      <Accordion type="single" collapsible className="mt-8">
        <AccordionItem value="faq-1">
          <AccordionTrigger className="text-left font-medium">
            Can I upgrade or downgrade my plan at any time?
          </AccordionTrigger>
          <AccordionContent>
            Yes, you can upgrade your plan at any time and the new features will be available immediately. When upgrading, we'll prorate your current subscription and apply any remaining credit to your new plan. Downgrading is also possible at the end of your current billing cycle.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-2">
          <AccordionTrigger className="text-left font-medium">
            What happens if I exceed my plan's limits?
          </AccordionTrigger>
          <AccordionContent>
            If you approach or exceed your plan's limits, we'll notify you. You can choose to upgrade to a higher tier or stay on your current plan with overage charges that will be billed at the end of your billing cycle. We'll never abruptly stop your workflows.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-3">
          <AccordionTrigger className="text-left font-medium">
            Do you offer discounts for annual billing?
          </AccordionTrigger>
          <AccordionContent>
            Yes, we offer a 15% discount when you choose annual billing for any of our plans. The discount will be automatically applied at checkout when you select the annual option.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-4">
          <AccordionTrigger className="text-left font-medium">
            What payment methods do you accept?
          </AccordionTrigger>
          <AccordionContent>
            We accept all major credit cards (Visa, Mastercard, American Express, Discover) and PayPal. For Enterprise plans, we can also accommodate invoicing, wire transfers, and purchase orders.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="faq-5">
          <AccordionTrigger className="text-left font-medium">
            Do you offer a free trial?
          </AccordionTrigger>
          <AccordionContent>
            We offer a 14-day free trial of our Professional plan with no credit card required. You'll have full access to all features during the trial period, and we'll send you a reminder before it ends so you can decide if you want to continue.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

// Helper function to render feature values
const renderFeatureValue = (value: string | boolean) => {
  if (typeof value === 'boolean') {
    if (value) {
      return <Icons.check className="inline h-5 w-5 text-green-500" />;
    } else {
      return <Icons.x className="inline h-5 w-5 text-slate-300" />;
    }
  }
  
  return <span>{value}</span>;
};

export default FeatureComparison;