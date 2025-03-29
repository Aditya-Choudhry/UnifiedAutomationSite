import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";

// Define integration categories and integrations
const integrationCategories = [
  {
    id: 'productivity',
    name: 'Productivity',
    icon: 'layoutGrid',
    color: 'bg-blue-500'
  },
  {
    id: 'crm',
    name: 'CRM & Marketing',
    icon: 'users',
    color: 'bg-green-500'
  },
  {
    id: 'communication',
    name: 'Communication',
    icon: 'messageCircle',
    color: 'bg-purple-500'
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    icon: 'code',
    color: 'bg-amber-500'
  }
];

const integrations = [
  {
    id: 'slack',
    name: 'Slack',
    category: 'communication',
    description: 'Send notifications and messages to Slack channels',
    icon: 'messageSquare',
    popular: true,
    actions: ['Send message', 'Create channel', 'Add user to channel'],
    triggers: ['New message', 'Channel created', 'Reaction added']
  },
  {
    id: 'gmail',
    name: 'Gmail',
    category: 'communication',
    description: 'Send and receive emails through Gmail',
    icon: 'mail',
    popular: true,
    actions: ['Send email', 'Create draft', 'Add label'],
    triggers: ['New email', 'Email opened', 'Email labeled']
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    category: 'productivity',
    description: 'Create and update Google Sheets spreadsheets',
    icon: 'table',
    popular: true,
    actions: ['Add row', 'Update cell', 'Create sheet'],
    triggers: ['Row added', 'Cell updated', 'New comment']
  },
  {
    id: 'trello',
    name: 'Trello',
    category: 'productivity',
    description: 'Manage Trello boards and cards',
    icon: 'listTodo',
    popular: false,
    actions: ['Create card', 'Move card', 'Add comment'],
    triggers: ['Card created', 'Card moved', 'Due date approaching']
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'crm',
    description: 'Integrate with Salesforce CRM',
    icon: 'cloudLightning',
    popular: true,
    actions: ['Create record', 'Update record', 'Add task'],
    triggers: ['Record created', 'Opportunity updated', 'Task completed']
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'crm',
    description: 'Connect with HubSpot CRM and marketing tools',
    icon: 'activity',
    popular: false,
    actions: ['Create contact', 'Add to workflow', 'Send marketing email'],
    triggers: ['Contact created', 'Deal stage changed', 'Form submitted']
  },
  {
    id: 'github',
    name: 'GitHub',
    category: 'developer',
    description: 'Automate GitHub repository tasks',
    icon: 'gitBranch',
    popular: false,
    actions: ['Create issue', 'Add comment', 'Create PR'],
    triggers: ['New PR', 'Issue closed', 'PR merged']
  },
  {
    id: 'stripe',
    name: 'Stripe',
    category: 'developer',
    description: 'Process payments and manage subscriptions',
    icon: 'creditCard',
    popular: true,
    actions: ['Create charge', 'Update subscription', 'Create customer'],
    triggers: ['Payment received', 'Subscription created', 'Payment failed']
  }
];

export default function IntegrationShowcase() {
  const [activeCategory, setActiveCategory] = React.useState('all');
  
  // Filter integrations by category
  const filteredIntegrations = activeCategory === 'all' 
    ? integrations 
    : integrations.filter(integration => integration.category === activeCategory);
  
  // Get popular integrations
  const popularIntegrations = integrations.filter(integration => integration.popular);
  
  return (
    <div className="bg-white shadow-lg rounded-xl border overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <h3 className="text-xl font-bold mb-2">Powerful Integrations</h3>
        <p className="opacity-90">Connect your favorite apps and services to build powerful workflows</p>
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActiveCategory} className="p-6">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {integrationCategories.map(category => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-4">
          <div className="mb-8">
            <h4 className="text-lg font-semibold mb-4">Popular Integrations</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularIntegrations.map(integration => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </div>
          </div>
          
          <h4 className="text-lg font-semibold mb-4">All Integrations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map(integration => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </TabsContent>
        
        {integrationCategories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIntegrations.map(integration => (
                <IntegrationCard key={integration.id} integration={integration} />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

interface IntegrationProps {
  integration: typeof integrations[0];
}

function IntegrationCard({ integration }: IntegrationProps) {
  const IconComponent = Icons[integration.icon] || Icons.activity;
  const category = integrationCategories.find(cat => cat.id === integration.category);
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition">
      <CardHeader className="p-4 pb-2 flex flex-row items-center gap-3 space-y-0">
        <div className={`p-2 rounded-md ${category?.color || 'bg-slate-500'} text-white`}>
          <IconComponent className="h-5 w-5" />
        </div>
        <div>
          <CardTitle className="text-base">{integration.name}</CardTitle>
          <CardDescription className="text-xs line-clamp-1">{integration.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="mt-2 space-y-3">
          <div>
            <h4 className="text-xs font-medium text-slate-500 mb-1">Triggers</h4>
            <div className="flex flex-wrap gap-1">
              {integration.triggers.slice(0, 2).map(trigger => (
                <Badge key={trigger} variant="outline" className="text-xs font-normal">
                  {trigger}
                </Badge>
              ))}
              {integration.triggers.length > 2 && (
                <Badge variant="outline" className="text-xs font-normal">
                  +{integration.triggers.length - 2} more
                </Badge>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-medium text-slate-500 mb-1">Actions</h4>
            <div className="flex flex-wrap gap-1">
              {integration.actions.slice(0, 2).map(action => (
                <Badge key={action} variant="outline" className="text-xs font-normal">
                  {action}
                </Badge>
              ))}
              {integration.actions.length > 2 && (
                <Badge variant="outline" className="text-xs font-normal">
                  +{integration.actions.length - 2} more
                </Badge>
              )}
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full mt-2">
            <Icons.plus className="mr-2 h-3 w-3" /> Add to Workflow
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}