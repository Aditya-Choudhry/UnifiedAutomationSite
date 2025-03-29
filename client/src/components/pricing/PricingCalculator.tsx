import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";

const PricingCalculator = () => {
  const [workflows, setWorkflows] = useState(5);
  const [tasks, setTasks] = useState(1000);
  const [users, setUsers] = useState(3);
  const [selectedTier, setSelectedTier] = useState('starter');
  const [totalPrice, setTotalPrice] = useState(29);

  // Calculate suggested plan and price based on selections
  useEffect(() => {
    let tier = 'starter';
    let price = 29;
    
    // Determine the best tier based on volume
    if (workflows > 10 || tasks > 10000 || users > 10) {
      tier = 'enterprise';
      price = 249;
    } else if (workflows > 5 || tasks > 2000 || users > 5) {
      tier = 'professional';
      price = 79;
    }
    
    // Calculate overage costs if staying on lower tier
    if (tier !== 'enterprise') {
      if (tier === 'starter') {
        const additionalWorkflows = Math.max(0, workflows - 5);
        const additionalTasks = Math.max(0, tasks - 1000);
        const additionalUsers = Math.max(0, users - 3);
        
        price += additionalWorkflows * 5;
        price += Math.floor(additionalTasks / 100) * 1;
        price += additionalUsers * 10;
      } else if (tier === 'professional') {
        const additionalWorkflows = Math.max(0, workflows - 10);
        const additionalTasks = Math.max(0, tasks - 10000);
        const additionalUsers = Math.max(0, users - 10);
        
        price += additionalWorkflows * 3;
        price += Math.floor(additionalTasks / 1000) * 5;
        price += additionalUsers * 8;
      }
    }
    
    setSelectedTier(tier);
    setTotalPrice(price);
  }, [workflows, tasks, users]);

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Pricing Calculator</CardTitle>
        <CardDescription>Estimate your costs based on expected usage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Workflows slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-700">Number of Workflows</label>
            <span className="text-sm font-bold">{workflows}</span>
          </div>
          <Slider
            value={[workflows]}
            min={1}
            max={30}
            step={1}
            onValueChange={(value) => setWorkflows(value[0])}
            className="mb-4"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>1</span>
            <span>15</span>
            <span>30</span>
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
            max={50000}
            step={100}
            onValueChange={(value) => setTasks(value[0])}
            className="mb-4"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>100</span>
            <span>25K</span>
            <span>50K</span>
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
            max={20}
            step={1}
            onValueChange={(value) => setUsers(value[0])}
            className="mb-4"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>1</span>
            <span>10</span>
            <span>20</span>
          </div>
        </div>
        
        {/* Estimated cost */}
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Estimated Monthly Cost:</span>
            <span className="text-2xl font-bold text-primary-600">${totalPrice}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Recommended Plan:</span>
            <Badge className="capitalize bg-primary-500">
              {selectedTier}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="w-full" onClick={() => {
          setWorkflows(5);
          setTasks(1000);
          setUsers(3);
        }}>
          <Icons.undo className="mr-2 h-4 w-4" /> Reset
        </Button>
        <Button className="w-full ml-2">
          <Icons.shoppingCart className="mr-2 h-4 w-4" /> Get Started
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCalculator;