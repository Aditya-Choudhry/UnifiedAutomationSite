import React, { useState, useRef, useEffect } from 'react';
import WorkflowNode, { NodeData, NodeType } from './WorkflowNode';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Icons } from '@/lib/icons';
import { Badge } from "@/components/ui/badge";

// Available node templates
export const nodeTemplates: NodeData[] = [
  {
    id: 'template-trigger-new-form',
    type: 'trigger',
    title: 'New Form Submission',
    description: 'Trigger when a form is submitted',
    icon: 'formInput'
  },
  {
    id: 'template-trigger-new-user',
    type: 'trigger',
    title: 'New User Signup',
    description: 'Trigger when a new user signs up',
    icon: 'userPlus'
  },
  {
    id: 'template-trigger-email-received',
    type: 'trigger',
    title: 'Email Received',
    description: 'Trigger when a specific email is received',
    icon: 'mail'
  },
  {
    id: 'template-action-send-email',
    type: 'action',
    title: 'Send Email',
    description: 'Send an email to recipients',
    icon: 'send'
  },
  {
    id: 'template-action-create-task',
    type: 'action',
    title: 'Create Task',
    description: 'Create a task in task management system',
    icon: 'listTodo'
  },
  {
    id: 'template-action-update-crm',
    type: 'action',
    title: 'Update CRM',
    description: 'Update customer information in CRM',
    icon: 'users'
  },
  {
    id: 'template-condition-check-value',
    type: 'condition',
    title: 'Check Value',
    description: 'Branch based on data values',
    icon: 'gitBranch'
  },
  {
    id: 'template-delay-wait',
    type: 'delay',
    title: 'Wait',
    description: 'Wait for a specific duration',
    icon: 'clock'
  },
  {
    id: 'template-data-transform',
    type: 'data',
    title: 'Transform Data',
    description: 'Modify or transform data',
    icon: 'arrowDownUp'
  }
];

// Sample workflow templates
export const workflowTemplates = [
  {
    id: 'customer-onboarding',
    name: 'Customer Onboarding',
    description: 'Automate the customer onboarding process',
    nodes: [
      {
        id: '1',
        type: 'trigger' as NodeType,
        title: 'New User Signup',
        description: 'Trigger when a new user signs up',
        icon: 'userPlus',
        position: { x: 100, y: 100 },
        configData: {
          'Source': 'Website Signup Form'
        }
      },
      {
        id: '2',
        type: 'action' as NodeType,
        title: 'Send Welcome Email',
        description: 'Send a welcome email to the new user',
        icon: 'send',
        position: { x: 100, y: 250 },
        connectedTo: ['1'],
        configData: {
          'Template': 'Welcome Email',
          'Subject': 'Welcome to Unified Automation Hub!'
        }
      },
      {
        id: '3',
        type: 'action' as NodeType,
        title: 'Create CRM Contact',
        description: 'Create a new contact in CRM',
        icon: 'users',
        position: { x: 100, y: 400 },
        connectedTo: ['2'],
        configData: {
          'CRM': 'Salesforce',
          'Record Type': 'Contact'
        }
      },
      {
        id: '4',
        type: 'action' as NodeType,
        title: 'Schedule Onboarding Call',
        description: 'Create a task to schedule onboarding call',
        icon: 'phone',
        position: { x: 100, y: 550 },
        connectedTo: ['3'],
        configData: {
          'Assignee': 'Customer Success Team',
          'Due': '3 days'
        }
      }
    ]
  },
  {
    id: 'lead-nurturing',
    name: 'Lead Nurturing',
    description: 'Nurture leads with automated follow-ups',
    nodes: [
      {
        id: '1',
        type: 'trigger' as NodeType,
        title: 'New Lead Created',
        description: 'Trigger when a new lead is created',
        icon: 'userPlus',
        position: { x: 100, y: 100 }
      },
      {
        id: '2',
        type: 'action' as NodeType,
        title: 'Send Initial Email',
        description: 'Send welcome email with resources',
        icon: 'send',
        position: { x: 100, y: 250 },
        connectedTo: ['1']
      },
      {
        id: '3',
        type: 'delay' as NodeType,
        title: 'Wait 3 Days',
        description: 'Wait for 3 days before next action',
        icon: 'clock',
        position: { x: 100, y: 400 },
        connectedTo: ['2']
      },
      {
        id: '4',
        type: 'condition' as NodeType,
        title: 'Email Opened?',
        description: 'Check if previous email was opened',
        icon: 'gitBranch',
        position: { x: 100, y: 550 },
        connectedTo: ['3']
      }
    ]
  },
  {
    id: 'customer-feedback',
    name: 'Customer Feedback',
    description: 'Collect and process customer feedback',
    nodes: [
      {
        id: '1',
        type: 'trigger' as NodeType,
        title: 'Form Submission',
        description: 'Customer submits feedback form',
        icon: 'formInput',
        position: { x: 100, y: 100 }
      },
      {
        id: '2',
        type: 'condition' as NodeType,
        title: 'Check Rating',
        description: 'Check customer satisfaction rating',
        icon: 'gitBranch',
        position: { x: 100, y: 250 },
        connectedTo: ['1']
      }
    ]
  }
];

interface WorkflowCanvasProps {
  onWorkflowCreate?: (nodes: NodeData[]) => void;
  onLivePreview?: (nodes: NodeData[]) => void;
}

export default function WorkflowCanvas({ onWorkflowCreate, onLivePreview }: WorkflowCanvasProps) {
  const [activeTab, setActiveTab] = useState('build');
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [startNodeId, setStartNodeId] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [workflowName, setWorkflowName] = useState('My Workflow');
  const [workflowDescription, setWorkflowDescription] = useState('');
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const nodesContainerRef = useRef<HTMLDivElement>(null);

  // Get selected node
  const selectedNode = nodes.find(node => node.id === selectedNodeId);

  // Reset workflow
  const resetWorkflow = () => {
    setNodes([]);
    setSelectedNodeId(null);
    setIsDrawingLine(false);
    setStartNodeId(null);
    setWorkflowName('My Workflow');
    setWorkflowDescription('');
  };

  // Handle loading a template
  const loadTemplate = (templateIndex: number) => {
    setSelectedTemplate(templateIndex);
    const template = workflowTemplates[templateIndex];
    setNodes(JSON.parse(JSON.stringify(template.nodes)));
    setWorkflowName(template.name);
    setWorkflowDescription(template.description);
  };

  // Handle node selection
  const handleNodeSelect = (id: string) => {
    if (isDrawingLine) {
      // Finish drawing line
      if (startNodeId && startNodeId !== id) {
        setNodes(prevNodes => 
          prevNodes.map(node => 
            node.id === startNodeId 
              ? { 
                  ...node, 
                  connectedTo: node.connectedTo 
                    ? [...node.connectedTo, id] 
                    : [id] 
                }
              : node
          )
        );
      }
      setIsDrawingLine(false);
      setStartNodeId(null);
    } else {
      setSelectedNodeId(id);
    }
  };
  
  // Start drawing line from a node
  const startDrawingLine = (id: string) => {
    setIsDrawingLine(true);
    setStartNodeId(id);
  };

  // Handle drag start for a node from the palette
  const handleDragStart = (e: React.DragEvent, nodeType: NodeType, templateId?: string) => {
    const templateNode = templateId 
      ? nodeTemplates.find(t => t.id === templateId)
      : null;
      
    e.dataTransfer.setData('nodeType', nodeType);
    e.dataTransfer.setData('nodeTemplate', templateId || '');
    
    if (templateNode) {
      e.dataTransfer.setData('nodeTitle', templateNode.title);
      e.dataTransfer.setData('nodeDescription', templateNode.description);
      e.dataTransfer.setData('nodeIcon', templateNode.icon);
    }
  };

  // Handle drop on the canvas
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    const nodeType = e.dataTransfer.getData('nodeType') as NodeType;
    const templateId = e.dataTransfer.getData('nodeTemplate');
    
    if (!nodeType) return;
    
    // Get template data if available
    let title = '';
    let description = '';
    let icon: keyof typeof Icons = 'activity';
    
    if (templateId) {
      const template = nodeTemplates.find(t => t.id === templateId);
      if (template) {
        title = template.title;
        description = template.description;
        icon = template.icon;
      }
    } else {
      title = e.dataTransfer.getData('nodeTitle') || `New ${nodeType}`;
      description = e.dataTransfer.getData('nodeDescription') || `Description for ${nodeType}`;
      icon = (e.dataTransfer.getData('nodeIcon') as keyof typeof Icons) || 'activity';
    }
    
    // Get position relative to the canvas
    const canvasRect = canvasRef.current?.getBoundingClientRect();
    const x = e.clientX - (canvasRect?.left || 0);
    const y = e.clientY - (canvasRect?.top || 0);
    
    // Create new node
    const newNode: NodeData = {
      id: `node-${Date.now()}`,
      type: nodeType,
      title,
      description,
      icon,
      position: { x, y }
    };
    
    setNodes(prevNodes => [...prevNodes, newNode]);
    setSelectedNodeId(newNode.id);
  };

  // Handle drag over on the canvas
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle click to share the workflow
  const handleShareWorkflow = () => {
    if (onWorkflowCreate) {
      onWorkflowCreate(nodes);
    }
    
    // Generate shareable link or show modal
    alert('Shareable link generated: https://unifiedautomation.hub/workflow/' + Date.now());
  };

  // Handle click to preview the workflow
  const handlePreviewWorkflow = () => {
    if (onLivePreview) {
      onLivePreview(nodes);
    }
    // Switch to preview tab
    setActiveTab('preview');
  };

  // Filter nodes by type for the node palette
  const getTriggerNodes = () => nodeTemplates.filter(node => node.type === 'trigger');
  const getActionNodes = () => nodeTemplates.filter(node => node.type === 'action');
  const getConditionNodes = () => nodeTemplates.filter(node => node.type === 'condition');
  const getUtilityNodes = () => nodeTemplates.filter(node => node.type === 'delay' || node.type === 'data');

  // Draw lines between connected nodes
  const renderLines = () => {
    return nodes.map(node => {
      if (!node.connectedTo || !node.position) return null;
      
      return node.connectedTo.map(targetId => {
        const targetNode = nodes.find(n => n.id === targetId);
        if (!targetNode || !targetNode.position) return null;
        
        // Calculate line start and end points
        const startX = node.position!.x + 150; // approximate node width/2
        const startY = node.position!.y + 60; // approximate node height/2
        const endX = targetNode.position!.x + 150;
        const endY = targetNode.position!.y + 60;
        
        return (
          <svg 
            key={`line-${node.id}-${targetId}`}
            className="absolute top-0 left-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
          >
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <circle cx={endX} cy={endY} r="4" fill="#94a3b8" />
          </svg>
        );
      });
    });
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden shadow-sm">
      <div className="bg-slate-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Icons.workflow className="h-5 w-5" />
          <h3 className="font-medium">Workflow Builder</h3>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600" onClick={resetWorkflow}>
            <Icons.undo className="mr-2 h-4 w-4" /> Reset
          </Button>
          <Button variant="outline" size="sm" className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600" onClick={handlePreviewWorkflow}>
            <Icons.play className="mr-2 h-4 w-4" /> Preview
          </Button>
          <Button size="sm" onClick={handleShareWorkflow}>
            <Icons.share className="mr-2 h-4 w-4" /> Share
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="border-b">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger 
              value="build" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-500 data-[state=active]:bg-transparent"
            >
              Build
            </TabsTrigger>
            <TabsTrigger 
              value="templates" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-500 data-[state=active]:bg-transparent"
            >
              Templates
            </TabsTrigger>
            <TabsTrigger 
              value="preview" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary-500 data-[state=active]:bg-transparent"
            >
              Preview
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Build Tab */}
        <TabsContent value="build" className="flex-1 flex overflow-hidden p-0 data-[state=inactive]:hidden">
          <div className="w-64 border-r bg-slate-50 overflow-auto">
            <div className="p-4">
              <h4 className="font-medium mb-2">Workflow details</h4>
              <div className="space-y-3 mb-4">
                <div>
                  <Label htmlFor="workflow-name">Name</Label>
                  <Input 
                    id="workflow-name" 
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="workflow-description">Description</Label>
                  <Textarea 
                    id="workflow-description"
                    value={workflowDescription}
                    onChange={(e) => setWorkflowDescription(e.target.value)}
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>
              
              <h4 className="font-medium mb-2">Components</h4>
              <ScrollArea className="h-[400px] pr-3">
                <div className="space-y-4">
                  <div>
                    <h5 className="text-xs font-semibold uppercase text-slate-500 mb-2">TRIGGERS</h5>
                    <div className="space-y-2">
                      {getTriggerNodes().map(node => (
                        <WorkflowNode 
                          key={node.id}
                          node={node}
                          isDraggable
                          onDragStart={handleDragStart}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-semibold uppercase text-slate-500 mb-2">ACTIONS</h5>
                    <div className="space-y-2">
                      {getActionNodes().map(node => (
                        <WorkflowNode
                          key={node.id}
                          node={node}
                          isDraggable
                          onDragStart={handleDragStart}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-semibold uppercase text-slate-500 mb-2">CONDITIONS</h5>
                    <div className="space-y-2">
                      {getConditionNodes().map(node => (
                        <WorkflowNode
                          key={node.id}
                          node={node}
                          isDraggable
                          onDragStart={handleDragStart}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-xs font-semibold uppercase text-slate-500 mb-2">UTILITIES</h5>
                    <div className="space-y-2">
                      {getUtilityNodes().map(node => (
                        <WorkflowNode
                          key={node.id}
                          node={node}
                          isDraggable
                          onDragStart={handleDragStart}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <div 
              ref={canvasRef}
              className="flex-1 bg-slate-100 overflow-auto relative"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {renderLines()}
              
              <div ref={nodesContainerRef} className="min-h-full min-w-full relative p-6">
                {nodes.map(node => (
                  <div 
                    key={node.id}
                    className="absolute w-72"
                    style={{ 
                      left: node.position?.x || 0, 
                      top: node.position?.y || 0
                    }}
                  >
                    <WorkflowNode
                      node={node}
                      isSelected={selectedNodeId === node.id}
                      onSelect={handleNodeSelect}
                    />
                  </div>
                ))}
                
                {nodes.length === 0 && (
                  <div className="h-full flex items-center justify-center text-slate-400">
                    <div className="text-center">
                      <Icons.workflow className="h-16 w-16 mx-auto mb-4 opacity-20" />
                      <p className="mb-2">Drag and drop components to build your workflow</p>
                      <p className="text-sm">Start with a trigger, then add actions and conditions</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {selectedNode && (
              <div className="h-56 border-t p-4 bg-white overflow-auto">
                <div className="flex justify-between mb-3">
                  <h4 className="font-medium">{selectedNode.title} Properties</h4>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => startDrawingLine(selectedNode.id)}
                      disabled={isDrawingLine}
                    >
                      <Icons.arrowRight className="mr-2 h-4 w-4" /> Connect
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 hover:text-red-600"
                      onClick={() => {
                        setNodes(prevNodes => prevNodes.filter(n => n.id !== selectedNode.id));
                        setSelectedNodeId(null);
                      }}
                    >
                      <Icons.trash className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="node-title">Title</Label>
                    <Input 
                      id="node-title" 
                      value={selectedNode.title}
                      onChange={(e) => {
                        setNodes(prevNodes => 
                          prevNodes.map(n => 
                            n.id === selectedNode.id 
                              ? { ...n, title: e.target.value } 
                              : n
                          )
                        );
                      }}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="node-type">Type</Label>
                    <Input 
                      id="node-type" 
                      value={selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
                      disabled
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div className="mt-3">
                  <Label htmlFor="node-description">Description</Label>
                  <Textarea 
                    id="node-description"
                    value={selectedNode.description}
                    onChange={(e) => {
                      setNodes(prevNodes => 
                        prevNodes.map(n => 
                          n.id === selectedNode.id 
                            ? { ...n, description: e.target.value } 
                            : n
                        )
                      );
                    }}
                    className="mt-1"
                    rows={2}
                  />
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Templates Tab */}
        <TabsContent value="templates" className="flex-1 overflow-auto p-6 data-[state=inactive]:hidden">
          <h3 className="text-xl font-bold mb-6">Starter Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowTemplates.map((template, index) => (
              <div 
                key={template.id}
                className={`border rounded-lg p-6 hover:shadow-md transition cursor-pointer ${
                  selectedTemplate === index ? 'ring-2 ring-primary-500 shadow-md' : ''
                }`}
                onClick={() => loadTemplate(index)}
              >
                <div className="flex items-start mb-3">
                  <div className="p-2 rounded-md bg-primary-100 text-primary-700 mr-3">
                    <Icons.workflow className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">{template.name}</h4>
                    <p className="text-sm text-slate-500">{template.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <Badge variant="outline">
                    {template.nodes.length} steps
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      loadTemplate(index);
                      setActiveTab('build');
                    }}
                  >
                    Use Template
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
        
        {/* Preview Tab */}
        <TabsContent value="preview" className="flex-1 overflow-auto p-6 data-[state=inactive]:hidden">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
              <h3 className="text-xl font-bold mb-2">{workflowName}</h3>
              <p className="text-slate-600 mb-6">{workflowDescription || 'No description provided.'}</p>
              
              <div className="space-y-4">
                {nodes.length > 0 ? (
                  nodes.map((node, index) => (
                    <div 
                      key={node.id}
                      className="flex items-start"
                    >
                      <div className="flex flex-col items-center mr-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getNodeBadgeColor(node.type)} text-white`}>
                          {index + 1}
                        </div>
                        {index < nodes.length - 1 && (
                          <div className="w-0.5 h-12 bg-slate-200 my-1"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 pt-1">
                        <div className="flex items-center mb-1">
                          <Badge className={`mr-2 ${getNodeBadgeColor(node.type)}`}>
                            {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                          </Badge>
                          <h4 className="font-bold">{node.title}</h4>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{node.description}</p>
                        
                        {node.configData && Object.keys(node.configData).length > 0 && (
                          <div className="bg-slate-50 rounded p-3 text-sm">
                            <h5 className="font-medium mb-1">Configuration:</h5>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(node.configData).map(([key, value]) => (
                                <div key={key} className="flex">
                                  <span className="font-medium mr-2">{key}:</span>
                                  <span className="text-slate-600">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Icons.info className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p>No workflow steps defined yet.</p>
                    <p className="text-sm mt-1">Go to the Build tab to create your workflow.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-primary-50 rounded-lg p-6 text-center">
              <h3 className="text-lg font-bold mb-2">Ready to implement this workflow?</h3>
              <p className="text-slate-600 mb-4">Get started with Unified Automation Hub today!</p>
              <div className="flex justify-center space-x-4">
                <Button>Sign Up Free</Button>
                <Button variant="outline" onClick={() => setActiveTab('build')}>
                  Edit Workflow
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}