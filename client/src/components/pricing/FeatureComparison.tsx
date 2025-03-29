import React from 'react';
import { Icons } from '@/lib/icons';

// Define feature categories and features
const featureCategories = [
  {
    name: 'Core Features',
    features: [
      { 
        name: 'Number of Workflows', 
        starter: 'Up to 5', 
        professional: 'Unlimited', 
        enterprise: 'Unlimited',
        description: 'The number of active workflows you can create and run'
      },
      { 
        name: 'Monthly Tasks', 
        starter: '1,000', 
        professional: '10,000', 
        enterprise: '100,000+',
        description: 'The number of workflow executions per month'
      },
      { 
        name: 'Users', 
        starter: '3', 
        professional: '10', 
        enterprise: 'Unlimited',
        description: 'The number of team members who can access your account'
      },
      { 
        name: 'Data Storage', 
        starter: '1 GB', 
        professional: '10 GB', 
        enterprise: '100 GB+',
        description: 'Storage for workflow data and history logs'
      }
    ]
  },
  {
    name: 'Workflow Features',
    features: [
      { 
        name: 'Basic Integrations', 
        starter: true, 
        professional: true, 
        enterprise: true,
        description: 'Connect with popular services like Gmail, Slack, Trello, etc.'
      },
      { 
        name: 'Advanced Integrations', 
        starter: false, 
        professional: true, 
        enterprise: true,
        description: 'Connect with enterprise systems like Salesforce, SAP, etc.'
      },
      { 
        name: 'Custom Integrations', 
        starter: false, 
        professional: false, 
        enterprise: true,
        description: 'Custom-built integrations for your specific needs'
      },
      { 
        name: 'Conditional Logic', 
        starter: 'Basic', 
        professional: 'Advanced', 
        enterprise: 'Advanced',
        description: 'Create workflows with conditional branching logic'
      },
      { 
        name: 'Error Handling', 
        starter: 'Basic', 
        professional: 'Advanced', 
        enterprise: 'Advanced with custom recovery',
        description: 'Error detection and recovery options'
      },
      { 
        name: 'Webhook Triggers', 
        starter: false, 
        professional: true, 
        enterprise: true,
        description: 'Trigger workflows via webhooks'
      },
      { 
        name: 'Scheduled Triggers', 
        starter: 'Limited', 
        professional: 'Unlimited', 
        enterprise: 'Unlimited',
        description: 'Schedule workflows to run at specific times'
      }
    ]
  },
  {
    name: 'Security & Compliance',
    features: [
      { 
        name: 'Data Encryption', 
        starter: 'In-transit', 
        professional: 'In-transit & at-rest', 
        enterprise: 'In-transit & at-rest with custom keys',
        description: 'Protection for your sensitive data'
      },
      { 
        name: 'User Roles & Permissions', 
        starter: 'Basic', 
        professional: 'Advanced', 
        enterprise: 'Custom',
        description: 'Control who can access and modify workflows'
      },
      { 
        name: 'Activity Logs', 
        starter: '30 days', 
        professional: '90 days', 
        enterprise: 'Unlimited',
        description: 'Track and audit user and workflow activities'
      },
      { 
        name: 'IP Restrictions', 
        starter: false, 
        professional: true, 
        enterprise: true,
        description: 'Restrict access to specific IP addresses'
      },
      { 
        name: 'SSO Integration', 
        starter: false, 
        professional: true, 
        enterprise: true,
        description: 'Single Sign-On with your identity provider'
      },
      { 
        name: 'Compliance Certifications', 
        starter: 'SOC 2', 
        professional: 'SOC 2, GDPR', 
        enterprise: 'SOC 2, GDPR, HIPAA, custom',
        description: 'Compliance with industry standards'
      }
    ]
  },
  {
    name: 'Support & Services',
    features: [
      { 
        name: 'Support Channels', 
        starter: 'Email', 
        professional: 'Email & Chat', 
        enterprise: 'Email, Chat & Phone',
        description: 'How you can get help when you need it'
      },
      { 
        name: 'Response Time', 
        starter: '24 hours', 
        professional: '8 hours', 
        enterprise: '2 hours',
        description: 'How quickly we respond to your support requests'
      },
      { 
        name: 'Onboarding', 
        starter: 'Self-service', 
        professional: 'Guided setup', 
        enterprise: 'Dedicated onboarding specialist',
        description: 'Help getting started with the platform'
      },
      { 
        name: 'Training', 
        starter: 'Documentation', 
        professional: 'Documentation & Webinars', 
        enterprise: 'Custom training sessions',
        description: 'Resources to help you and your team learn'
      },
      { 
        name: 'Account Management', 
        starter: false, 
        professional: false, 
        enterprise: true,
        description: 'Dedicated account manager for your organization'
      },
      { 
        name: 'SLA', 
        starter: false, 
        professional: 'Standard', 
        enterprise: 'Custom',
        description: 'Service Level Agreement guarantees'
      }
    ]
  }
];

// Feature comparison table component
const FeatureComparison = () => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-100">
            <th className="text-left p-4 w-1/3">Feature</th>
            <th className="text-center p-4 w-1/5">
              <div className="font-semibold text-lg">Starter</div>
              <div className="font-normal text-slate-500">$29/month</div>
            </th>
            <th className="text-center p-4 w-1/5">
              <div className="font-semibold text-lg">Professional</div>
              <div className="font-normal text-slate-500">$79/month</div>
            </th>
            <th className="text-center p-4 w-1/5">
              <div className="font-semibold text-lg">Enterprise</div>
              <div className="font-normal text-slate-500">$249/month</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {featureCategories.map((category, categoryIndex) => (
            <React.Fragment key={categoryIndex}>
              <tr className="bg-slate-50">
                <td colSpan={4} className="py-3 px-4 font-semibold text-primary-700">
                  {category.name}
                </td>
              </tr>
              
              {category.features.map((feature, featureIndex) => (
                <tr 
                  key={`${categoryIndex}-${featureIndex}`} 
                  className="border-t border-slate-200 hover:bg-slate-50"
                >
                  <td className="py-3 px-4 text-sm relative group">
                    <span>{feature.name}</span>
                    {feature.description && (
                      <div className="hidden group-hover:block absolute left-full ml-2 top-1/2 -translate-y-1/2 z-10 bg-slate-800 text-white text-xs p-2 rounded shadow-lg w-64">
                        {feature.description}
                      </div>
                    )}
                  </td>
                  
                  <td className="py-3 px-4 text-center text-sm">
                    {renderFeatureValue(feature.starter)}
                  </td>
                  
                  <td className="py-3 px-4 text-center text-sm">
                    {renderFeatureValue(feature.professional)}
                  </td>
                  
                  <td className="py-3 px-4 text-center text-sm">
                    {renderFeatureValue(feature.enterprise)}
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
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