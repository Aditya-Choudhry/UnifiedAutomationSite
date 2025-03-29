import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";

// Tutorial data
const tutorials = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Learn the basics of workflow automation',
    level: 'beginner',
    duration: '15 min',
    icon: 'mapPin',
    steps: [
      { title: 'What is Workflow Automation?', duration: '3 min', completed: true },
      { title: 'Creating Your First Workflow', duration: '5 min', completed: true },
      { title: 'Testing and Monitoring Workflows', duration: '4 min', completed: false },
      { title: 'Sharing and Deploying Workflows', duration: '3 min', completed: false }
    ]
  },
  {
    id: 'email-automation',
    title: 'Email Automation Mastery',
    description: 'Automate email sequences and notifications',
    level: 'intermediate',
    duration: '25 min',
    icon: 'mail',
    steps: [
      { title: 'Setting Up Email Triggers', duration: '5 min', completed: false },
      { title: 'Creating Conditional Email Paths', duration: '8 min', completed: false },
      { title: 'Personalization with Dynamic Content', duration: '7 min', completed: false },
      { title: 'Analytics and Optimization', duration: '5 min', completed: false }
    ]
  },
  {
    id: 'crm-integration',
    title: 'CRM Integration Workflows',
    description: 'Connect your CRM with other tools',
    level: 'advanced',
    duration: '40 min',
    icon: 'users',
    steps: [
      { title: 'CRM Data Synchronization', duration: '10 min', completed: false },
      { title: 'Lead Scoring Automation', duration: '12 min', completed: false },
      { title: 'Customer Journey Mapping', duration: '8 min', completed: false },
      { title: 'Advanced Reporting Workflows', duration: '10 min', completed: false }
    ]
  },
  {
    id: 'data-transformation',
    title: 'Data Transformation',
    description: 'Process and transform data between apps',
    level: 'intermediate',
    duration: '30 min',
    icon: 'arrowDownUp',
    steps: [
      { title: 'Understanding Data Formats', duration: '7 min', completed: false },
      { title: 'Mapping Fields Between Apps', duration: '8 min', completed: false },
      { title: 'Advanced Transformations', duration: '10 min', completed: false },
      { title: 'Error Handling and Fallbacks', duration: '5 min', completed: false }
    ]
  },
  {
    id: 'webhooks',
    title: 'Working with Webhooks',
    description: 'Create custom triggers with webhooks',
    level: 'advanced',
    duration: '35 min',
    icon: 'webhook',
    steps: [
      { title: 'Webhook Basics', duration: '8 min', completed: false },
      { title: 'Creating Custom Webhook Triggers', duration: '10 min', completed: false },
      { title: 'Webhook Security', duration: '7 min', completed: false },
      { title: 'Real-time Workflow Processing', duration: '10 min', completed: false }
    ]
  },
  {
    id: 'approval-workflows',
    title: 'Approval Workflows',
    description: 'Create workflows with human approval steps',
    level: 'intermediate',
    duration: '25 min',
    icon: 'checkSquare',
    steps: [
      { title: 'Designing Approval Processes', duration: '6 min', completed: false },
      { title: 'Implementing Approval Actions', duration: '7 min', completed: false },
      { title: 'Handling Approvals and Rejections', duration: '7 min', completed: false },
      { title: 'Escalation and Timeout Processes', duration: '5 min', completed: false }
    ]
  }
];

// Get tutorials by level
const beginnerTutorials = tutorials.filter(t => t.level === 'beginner');
const intermediateTutorials = tutorials.filter(t => t.level === 'intermediate');
const advancedTutorials = tutorials.filter(t => t.level === 'advanced');

export default function TutorialGuide() {
  return (
    <div className="bg-white shadow-lg rounded-xl border overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <h3 className="text-xl font-bold mb-2">Guided Tutorials</h3>
        <p className="opacity-90">Learn how to build powerful workflows through step-by-step tutorials</p>
      </div>
      
      <Tabs defaultValue="all" className="p-6">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Tutorials</TabsTrigger>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold mb-4">Continue Learning</h4>
            <TutorialCard tutorial={tutorials[0]} expanded />
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Suggested Tutorials</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tutorials.slice(1, 4).map(tutorial => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">All Tutorials</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tutorials.map(tutorial => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="beginner" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {beginnerTutorials.map(tutorial => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="intermediate" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {intermediateTutorials.map(tutorial => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="advanced" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {advancedTutorials.map(tutorial => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Tutorial Card Component
interface TutorialProps {
  tutorial: typeof tutorials[0];
  expanded?: boolean;
}

function TutorialCard({ tutorial, expanded = false }: TutorialProps) {
  // Use a render function approach which is safer for TypeScript
  const renderIcon = () => {
    switch (tutorial.icon) {
      case 'mail':
        return <Icons.mail className="h-5 w-5" />;
      case 'users':
        return <Icons.users className="h-5 w-5" />;
      case 'arrowDownUp':
        return <Icons.arrowDownUp className="h-5 w-5" />;
      case 'mapPin':
        return <Icons.info className="h-5 w-5" />; // Fallback if mapPin doesn't exist
      case 'webhook':
        return <Icons.arrowLeftRight className="h-5 w-5" />; // For webhook
      case 'checkSquare':
        return <Icons.check className="h-5 w-5" />; // For approval
      default:
        return <Icons.file className="h-5 w-5" />;
    }
  };
  
  // Calculate progress
  const completedSteps = tutorial.steps.filter(step => step.completed).length;
  const progress = (completedSteps / tutorial.steps.length) * 100;
  
  // Get level badge color
  const getLevelColor = (level: string) => {
    switch(level) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-blue-500';
      case 'advanced': return 'bg-purple-500';
      default: return 'bg-slate-500';
    }
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition">
      <CardHeader className="p-4 pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className={`p-2 rounded-md ${getLevelColor(tutorial.level)} text-white`}>
            {renderIcon()}
          </div>
          <Badge variant="outline" className="capitalize">
            {tutorial.level}
          </Badge>
        </div>
        <CardTitle className="text-lg">{tutorial.title}</CardTitle>
        <CardDescription>{tutorial.description}</CardDescription>
        
        <div className="flex items-center text-sm text-slate-500 mt-2">
          <Icons.clock className="h-4 w-4 mr-1" />
          <span>{tutorial.duration}</span>
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="p-4 pt-0">
          <div className="space-y-3">
            <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
              <div 
                className="bg-primary-500 h-2 rounded-full" 
                style={{ width: `${progress}%` }} 
              />
            </div>
            
            <div className="space-y-2">
              {tutorial.steps.map((step, index) => (
                <div key={index} className="flex items-start">
                  <div className={`mt-0.5 mr-2 w-5 h-5 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {step.completed ? (
                      <Icons.check className="h-3 w-3" />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className={step.completed ? 'line-through text-slate-400' : ''}>
                        {step.title}
                      </span>
                      <span className="text-xs text-slate-400">{step.duration}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      )}
      
      <CardFooter className="p-4 pt-0">
        <Button variant="default" className="w-full">
          {progress > 0 ? 'Continue Tutorial' : 'Start Tutorial'}
        </Button>
      </CardFooter>
    </Card>
  );
}