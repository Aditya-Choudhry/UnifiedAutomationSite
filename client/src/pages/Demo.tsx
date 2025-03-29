import { useState } from "react";
import { Icons } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import WorkflowCanvas from "@/components/demo/WorkflowCanvas";
import IntegrationShowcase from "@/components/demo/IntegrationShowcase";
import TutorialGuide from "@/components/demo/TutorialGuide";

export default function Demo() {
  const [activeStep, setActiveStep] = useState(1);
  const [workflowRunning, setWorkflowRunning] = useState(false);
  const [workflowComplete, setWorkflowComplete] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [activeDemoTab, setActiveDemoTab] = useState('builder');

  // Mock data for the demo
  const mockOutputData = {
    customer: {
      id: "cus_12345",
      name: "John Smith",
      email: "john.smith@example.com",
      created_at: new Date().toISOString(),
    },
    email: {
      id: "email_67890",
      subject: "Welcome to Unified Automation Hub!",
      sent_to: "john.smith@example.com",
      status: "delivered",
      sent_at: new Date().toISOString(),
    },
    task: {
      id: "task_54321",
      type: "onboarding",
      status: "completed",
      assigned_to: "sales@example.com",
    }
  };

  const runWorkflow = () => {
    setWorkflowRunning(true);
    
    // Simulate workflow execution
    setTimeout(() => {
      setWorkflowRunning(false);
      setWorkflowComplete(true);
      setShowOutput(true);
    }, 3000);
  };

  const resetDemo = () => {
    setActiveStep(1);
    setWorkflowRunning(false);
    setWorkflowComplete(false);
    setShowOutput(false);
  };

  const nextStep = () => {
    if (activeStep < 3) {
      setActiveStep(activeStep + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Experience the Power of Automation</h1>
            <p className="text-lg text-slate-300 mb-8">
              Try our interactive demo to see how easy it is to create, test, and deploy workflows 
              that connect your favorite apps and automate your business processes.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Button 
                className="bg-primary-500 hover:bg-primary-600" 
                size="lg"
                onClick={() => setActiveDemoTab('builder')}
              >
                <Icons.appWindow className="mr-2 h-5 w-5" /> Try Workflow Builder
              </Button>
              <Button 
                variant="outline" 
                className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700"
                size="lg"
                onClick={() => setActiveDemoTab('templates')}
              >
                <Icons.layoutTemplate className="mr-2 h-5 w-5" /> Browse Templates
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <Tabs value={activeDemoTab} onValueChange={setActiveDemoTab} className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="builder">
                <Icons.appWindow className="mr-2 h-4 w-4" /> Builder
              </TabsTrigger>
              <TabsTrigger value="templates">
                <Icons.layoutTemplate className="mr-2 h-4 w-4" /> Templates
              </TabsTrigger>
              <TabsTrigger value="integrations">
                <Icons.plugZap className="mr-2 h-4 w-4" /> Integrations
              </TabsTrigger>
              <TabsTrigger value="tutorials">
                <Icons.graduationCap className="mr-2 h-4 w-4" /> Tutorials
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Workflow Builder */}
          <TabsContent value="builder" className="space-y-8">
            <div className="max-w-6xl mx-auto">
              <WorkflowCanvas />
            </div>
          </TabsContent>
          
          {/* Basic Demo with Steps */}
          <TabsContent value="templates" className="space-y-8">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mb-8">
                <div className="bg-slate-800 text-white px-6 py-3 flex justify-between items-center">
                  <h3 className="font-medium">Demo: Customer Onboarding Workflow</h3>
                  <div className="flex items-center space-x-2">
                    {workflowComplete ? (
                      <Badge className="bg-green-500">Completed</Badge>
                    ) : workflowRunning ? (
                      <Badge className="bg-amber-500">Running</Badge>
                    ) : (
                      <Badge className="bg-slate-500">Ready</Badge>
                    )}
                  </div>
                </div>

                <div className="p-6">
                  {/* Workflow Steps Indicator */}
                  <div className="flex items-center justify-between mb-8 relative">
                    <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
                    
                    <div className={`relative z-10 flex flex-col items-center ${activeStep >= 1 ? 'text-primary-600' : 'text-slate-400'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 1 ? 'bg-primary-100 border-2 border-primary-500' : 'bg-slate-100 border-2 border-slate-300'}`}>
                        <span className="font-bold">1</span>
                      </div>
                      <span className="text-sm mt-2 font-medium">Configure</span>
                    </div>
                    
                    <div className={`relative z-10 flex flex-col items-center ${activeStep >= 2 ? 'text-primary-600' : 'text-slate-400'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 2 ? 'bg-primary-100 border-2 border-primary-500' : 'bg-slate-100 border-2 border-slate-300'}`}>
                        <span className="font-bold">2</span>
                      </div>
                      <span className="text-sm mt-2 font-medium">Review</span>
                    </div>
                    
                    <div className={`relative z-10 flex flex-col items-center ${activeStep >= 3 ? 'text-primary-600' : 'text-slate-400'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activeStep >= 3 ? 'bg-primary-100 border-2 border-primary-500' : 'bg-slate-100 border-2 border-slate-300'}`}>
                        <span className="font-bold">3</span>
                      </div>
                      <span className="text-sm mt-2 font-medium">Execute</span>
                    </div>
                  </div>
                  
                  {/* Step Content */}
                  <div className="mb-6">
                    {activeStep === 1 && (
                      <div>
                        <h4 className="text-xl font-bold mb-4">Configure Workflow</h4>
                        <p className="mb-6 text-slate-600">Configure the customer onboarding workflow with the necessary information.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="customer-name">Customer Name</Label>
                              <Input id="customer-name" defaultValue="John Smith" />
                            </div>
                            <div>
                              <Label htmlFor="customer-email">Customer Email</Label>
                              <Input id="customer-email" defaultValue="john.smith@example.com" type="email" />
                            </div>
                            <div>
                              <Label htmlFor="customer-phone">Customer Phone</Label>
                              <Input id="customer-phone" defaultValue="(555) 123-4567" />
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="welcome-template">Welcome Email Template</Label>
                              <select id="welcome-template" className="w-full border border-slate-300 rounded-md px-3 py-2">
                                <option>Standard Welcome</option>
                                <option>Premium Onboarding</option>
                                <option>Technical Setup Guide</option>
                              </select>
                            </div>
                            <div>
                              <Label htmlFor="assign-to">Assign to Team Member</Label>
                              <select id="assign-to" className="w-full border border-slate-300 rounded-md px-3 py-2">
                                <option>Account Management</option>
                                <option>Technical Support</option>
                                <option>Sales Team</option>
                              </select>
                            </div>
                            <div>
                              <Label htmlFor="notes">Additional Notes</Label>
                              <Textarea id="notes" placeholder="Enter any special instructions or notes about this customer" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {activeStep === 2 && (
                      <div>
                        <h4 className="text-xl font-bold mb-4">Review Workflow</h4>
                        <p className="mb-6 text-slate-600">Review the workflow steps and configuration before executing.</p>
                        
                        <div className="space-y-6">
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Step 1: Create Customer Record</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Name:</span>
                                  <span className="font-medium">John Smith</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Email:</span>
                                  <span className="font-medium">john.smith@example.com</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Phone:</span>
                                  <span className="font-medium">(555) 123-4567</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Step 2: Send Welcome Email</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Template:</span>
                                  <span className="font-medium">Standard Welcome</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Recipient:</span>
                                  <span className="font-medium">john.smith@example.com</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">Step 3: Create Follow-up Task</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Assigned to:</span>
                                  <span className="font-medium">Account Management</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-slate-500">Due date:</span>
                                  <span className="font-medium">Tomorrow</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    )}
                    
                    {activeStep === 3 && (
                      <div>
                        <h4 className="text-xl font-bold mb-4">Execute Workflow</h4>
                        <p className="mb-6 text-slate-600">
                          Run the workflow to see it in action. This is a simulated demo so no actual emails will be sent.
                        </p>
                        
                        {!workflowComplete ? (
                          <div className="bg-slate-50 rounded-lg p-6 text-center">
                            <div className="mb-4">
                              {workflowRunning ? (
                                <div className="animate-spin w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
                              ) : (
                                <Icons.play className="w-16 h-16 text-primary-500 mx-auto" />
                              )}
                            </div>
                            
                            {workflowRunning ? (
                              <div>
                                <h5 className="font-bold mb-2">Workflow Running...</h5>
                                <p className="text-slate-500">Please wait while we process your request.</p>
                              </div>
                            ) : (
                              <div>
                                <h5 className="font-bold mb-2">Ready to Execute</h5>
                                <p className="text-slate-500 mb-4">Click the button below to run the workflow.</p>
                                <Button onClick={runWorkflow} className="mx-auto">
                                  <Icons.play className="mr-2 h-4 w-4" /> Run Workflow
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 flex items-center">
                              <Icons.check className="h-5 w-5 mr-2" />
                              <span>Workflow executed successfully!</span>
                            </div>
                            
                            <Tabs defaultValue="output">
                              <TabsList className="mb-4">
                                <TabsTrigger value="output">Output Data</TabsTrigger>
                                <TabsTrigger value="logs">Execution Logs</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="output">
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Workflow Results</CardTitle>
                                    <CardDescription>Data generated during workflow execution</CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-auto text-sm">
                                      {JSON.stringify(mockOutputData, null, 2)}
                                    </pre>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                              
                              <TabsContent value="logs">
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Execution Logs</CardTitle>
                                    <CardDescription>Step-by-step execution details</CardDescription>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-auto text-sm h-64">
                                      <div className="text-green-400">[2025-03-29 09:24:03] Starting workflow execution...</div>
                                      <div className="text-slate-400">[2025-03-29 09:24:03] Step 1: Creating customer record...</div>
                                      <div className="text-slate-400">[2025-03-29 09:24:04] Customer record created successfully with ID cus_12345</div>
                                      <div className="text-slate-400">[2025-03-29 09:24:04] Step 2: Sending welcome email...</div>
                                      <div className="text-slate-400">[2025-03-29 09:24:05] Email queued for delivery to john.smith@example.com</div>
                                      <div className="text-slate-400">[2025-03-29 09:24:05] Email delivered successfully</div>
                                      <div className="text-slate-400">[2025-03-29 09:24:05] Step 3: Creating follow-up task...</div>
                                      <div className="text-slate-400">[2025-03-29 09:24:06] Task assigned to Account Management team</div>
                                      <div className="text-green-400">[2025-03-29 09:24:06] Workflow execution completed successfully</div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>
                            </Tabs>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Navigation Buttons */}
                  <div className="flex justify-between">
                    <div>
                      {activeStep > 1 && (
                        <Button variant="outline" onClick={prevStep}>
                          <Icons.arrowLeft className="mr-2 h-4 w-4" /> Previous
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex space-x-3">
                      {workflowComplete && (
                        <Button variant="outline" onClick={resetDemo}>
                          <Icons.refresh className="mr-2 h-4 w-4" /> Reset Demo
                        </Button>
                      )}
                      
                      {activeStep < 3 && (
                        <Button onClick={nextStep}>
                          Next <Icons.arrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-8">
            <div className="max-w-6xl mx-auto">
              <IntegrationShowcase />
            </div>
          </TabsContent>

          {/* Tutorials */}
          <TabsContent value="tutorials" className="space-y-8">
            <div className="max-w-6xl mx-auto">
              <TutorialGuide />
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl p-8 text-center mt-24">
          <h2 className="text-2xl font-bold mb-3">Ready to automate your business?</h2>
          <p className="text-primary-50 mb-6">Get started with your own custom workflows today.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary-600 hover:bg-primary-50 hover:text-primary-700" size="lg">
              Sign Up Free
            </Button>
            <Button variant="outline" className="text-white border-primary-300 hover:bg-primary-400" size="lg">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}