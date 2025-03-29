import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Icons } from "@/lib/icons";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface PricingScenario {
  name: string;
  workflows: number;
  tasks: number;
  users: number;
  storage: number;
  includeAdvancedFeatures: boolean;
}

const predefinedScenarios: PricingScenario[] = [
  {
    name: "Small Business Automation",
    workflows: 3,
    tasks: 800,
    users: 2,
    storage: 0.5,
    includeAdvancedFeatures: false
  },
  {
    name: "Marketing Team",
    workflows: 8,
    tasks: 5000,
    users: 6,
    storage: 5,
    includeAdvancedFeatures: true
  },
  {
    name: "Enterprise IT Department",
    workflows: 25,
    tasks: 30000,
    users: 15,
    storage: 50,
    includeAdvancedFeatures: true
  }
];

const UsageCalculator = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  
  const [workflows, setWorkflows] = useState(5);
  const [tasks, setTasks] = useState(1000);
  const [users, setUsers] = useState(3);
  const [storage, setStorage] = useState(1);
  const [includeAdvancedFeatures, setIncludeAdvancedFeatures] = useState(false);
  
  // Calculate base price based on usage
  const calculateBasePrice = (): number => {
    // Base pricing per unit
    const workflowPrice = 5;
    const tasksPer1000Price = 10;
    const userPrice = 20;
    const storagePerGBPrice = 0.5;
    const advancedFeaturesPrice = 49;
    
    // Calculate cost for each component
    const workflowsCost = workflows * workflowPrice;
    const tasksCost = (tasks / 1000) * tasksPer1000Price;
    const usersCost = users * userPrice;
    const storageCost = storage * storagePerGBPrice;
    const featuresCost = includeAdvancedFeatures ? advancedFeaturesPrice : 0;
    
    // Total monthly price
    let monthlyPrice = workflowsCost + tasksCost + usersCost + storageCost + featuresCost;
    
    // Apply discount for annual billing
    if (billingCycle === 'annual') {
      monthlyPrice = monthlyPrice * 0.85; // 15% discount for annual billing
    }
    
    return parseFloat(monthlyPrice.toFixed(2));
  };
  
  // Determine recommended tier based on usage
  const getRecommendedTier = (): string => {
    if (workflows <= 5 && tasks <= 1000 && users <= 3 && !includeAdvancedFeatures) {
      return 'Starter';
    } else if (workflows <= 15 && tasks <= 15000 && users <= 10) {
      return 'Professional';
    } else {
      return 'Enterprise';
    }
  };
  
  // Price per month
  const monthlyPrice = calculateBasePrice();
  
  // Annual price (monthly price * 12)
  const annualPrice = monthlyPrice * 12;
  
  // Apply scenario
  const applyScenario = (scenario: PricingScenario) => {
    setWorkflows(scenario.workflows);
    setTasks(scenario.tasks);
    setUsers(scenario.users);
    setStorage(scenario.storage);
    setIncludeAdvancedFeatures(scenario.includeAdvancedFeatures);
    setSelectedScenario(scenario.name);
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl flex justify-between items-center">
          <span>Advanced Usage Calculator</span>
          <div className="flex items-center gap-2 text-sm font-normal">
            <Label htmlFor="billing-cycle" className="text-slate-600">Monthly</Label>
            <Switch 
              id="billing-cycle" 
              checked={billingCycle === 'annual'}
              onCheckedChange={(checked) => setBillingCycle(checked ? 'annual' : 'monthly')}
            />
            <Label htmlFor="billing-cycle" className={`${billingCycle === 'annual' ? 'text-primary-600 font-medium' : 'text-slate-600'}`}>
              Annual <Badge variant="outline" className="ml-1 bg-primary-50 text-primary-700 border-primary-200">Save 15%</Badge>
            </Label>
          </div>
        </CardTitle>
        <CardDescription>Detailed cost estimation based on your specific usage patterns</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="custom">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="custom" className="flex-1">
              <Icons.settings className="mr-2 h-4 w-4" /> Custom Usage
            </TabsTrigger>
            <TabsTrigger value="scenarios" className="flex-1">
              <Icons.lightbulb className="mr-2 h-4 w-4" /> Common Scenarios
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="custom" className="space-y-4">
            {/* Workflows slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Number of Workflows</label>
                <span className="text-sm font-bold">{workflows}</span>
              </div>
              <Slider
                value={[workflows]}
                min={1}
                max={50}
                step={1}
                onValueChange={(value) => setWorkflows(value[0])}
                className="mb-4"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>1</span>
                <span>25</span>
                <span>50</span>
              </div>
            </div>
            
            {/* Tasks per month slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Tasks per Month</label>
                <span className="text-sm font-bold">{tasks.toLocaleString()}</span>
              </div>
              <Slider
                value={[tasks]}
                min={100}
                max={100000}
                step={100}
                onValueChange={(value) => setTasks(value[0])}
                className="mb-4"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>100</span>
                <span>50K</span>
                <span>100K</span>
              </div>
            </div>
            
            {/* Team members slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Team Members</label>
                <span className="text-sm font-bold">{users}</span>
              </div>
              <Slider
                value={[users]}
                min={1}
                max={30}
                step={1}
                onValueChange={(value) => setUsers(value[0])}
                className="mb-4"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>1</span>
                <span>15</span>
                <span>30</span>
              </div>
            </div>
            
            {/* Storage slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Storage (GB)</label>
                <span className="text-sm font-bold">{storage} GB</span>
              </div>
              <Slider
                value={[storage]}
                min={0.5}
                max={100}
                step={0.5}
                onValueChange={(value) => setStorage(value[0])}
                className="mb-4"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>0.5 GB</span>
                <span>50 GB</span>
                <span>100 GB</span>
              </div>
            </div>
            
            {/* Advanced Features toggle */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium text-slate-700">Advanced Features</Label>
                <p className="text-xs text-slate-500">Includes advanced security, custom integrations, and API access</p>
              </div>
              <Switch
                checked={includeAdvancedFeatures}
                onCheckedChange={setIncludeAdvancedFeatures}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="scenarios" className="space-y-4">
            {predefinedScenarios.map((scenario, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-slate-50 cursor-pointer" onClick={() => applyScenario(scenario)}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{scenario.name}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      applyScenario(scenario);
                    }}
                  >
                    <Icons.check className="mr-2 h-4 w-4" /> Apply
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                  <div>Workflows: <span className="font-medium">{scenario.workflows}</span></div>
                  <div>Users: <span className="font-medium">{scenario.users}</span></div>
                  <div>Monthly Tasks: <span className="font-medium">{scenario.tasks.toLocaleString()}</span></div>
                  <div>Storage: <span className="font-medium">{scenario.storage} GB</span></div>
                  <div className="col-span-2">
                    Advanced Features: <span className="font-medium">{scenario.includeAdvancedFeatures ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
        
        {/* Cost Breakdown */}
        <div className="bg-slate-50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-base font-semibold">Cost Breakdown</span>
            <Badge variant="outline">{getRecommendedTier()} Plan</Badge>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Workflows ({workflows})</span>
            <span>${(workflows * 5).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Tasks ({tasks.toLocaleString()})</span>
            <span>${((tasks / 1000) * 10).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Team Members ({users})</span>
            <span>${(users * 20).toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Storage ({storage} GB)</span>
            <span>${(storage * 0.5).toFixed(2)}</span>
          </div>
          
          {includeAdvancedFeatures && (
            <div className="flex justify-between text-sm">
              <span>Advanced Features</span>
              <span>$49.00</span>
            </div>
          )}
          
          {billingCycle === 'annual' && (
            <div className="flex justify-between text-sm text-green-600">
              <span>Annual Discount (15%)</span>
              <span>-${(monthlyPrice / 0.85 * 0.15).toFixed(2)}</span>
            </div>
          )}
          
          <div className="pt-2 border-t border-slate-200 flex justify-between font-semibold">
            <span>Total {billingCycle === 'monthly' ? 'Monthly' : 'Monthly (Annual Billing)'}</span>
            <span className="text-xl text-primary-600">${monthlyPrice}</span>
          </div>
          
          {billingCycle === 'annual' && (
            <div className="flex justify-between text-sm pt-1">
              <span>Annual Total (Billed Once)</span>
              <span className="font-medium">${annualPrice.toFixed(2)}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4">
        <Button className="w-full">
          <Icons.shoppingCart className="mr-2 h-4 w-4" /> Start {billingCycle === 'annual' ? 'Annual' : 'Monthly'} Subscription
        </Button>
        <p className="text-xs text-center text-slate-500">
          Prices are in USD. VAT may apply depending on your location.
          Need a larger plan? <a href="#" className="text-primary-600 font-medium hover:underline">Contact our sales team</a>.
        </p>
      </CardFooter>
    </Card>
  );
};

export default UsageCalculator;