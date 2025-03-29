import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icons } from "@/lib/icons";
import { NodeData, NodeParameter, NodeType, NodeValidationError } from "./WorkflowNode";

interface NodeConfigPanelProps {
  node: NodeData;
  allNodes: NodeData[];
  onConfigUpdate: (nodeId: string, updates: Partial<NodeData>) => void;
  onDeleteNode: (nodeId: string) => void;
  onStartConnection: (nodeId: string) => void;
  onTestNode: (nodeId: string) => void;
  isDrawingLine: boolean;
}

export default function NodeConfigPanel({
  node,
  allNodes,
  onConfigUpdate,
  onDeleteNode,
  onStartConnection,
  onTestNode,
  isDrawingLine
}: NodeConfigPanelProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [validationErrors, setValidationErrors] = useState<NodeValidationError[]>(node.validationErrors || []);
  
  // Get all nodes that could be source nodes for this node (excluding itself)
  const potentialSourceNodes = allNodes.filter(n => n.id !== node.id);
  
  // Get connected source nodes
  const sourceNodes = node.dataMappings 
    ? allNodes.filter(n => node.dataMappings?.some(m => m.sourceNodeId === n.id))
    : [];
  
  // Update basic information
  const updateBasicInfo = (field: string, value: string) => {
    onConfigUpdate(node.id, { [field]: value });
  };
  
  // Add a new input parameter
  const addInputParameter = () => {
    const newParam: NodeParameter = {
      id: `param_${Date.now()}`,
      name: 'New Parameter',
      type: 'string',
      required: false,
      description: 'Parameter description'
    };
    
    onConfigUpdate(node.id, { 
      inputs: [...(node.inputs || []), newParam]
    });
  };
  
  // Update an input parameter
  const updateInputParameter = (paramId: string, field: string, value: any) => {
    if (!node.inputs) return;
    
    const updatedInputs = node.inputs.map(param => 
      param.id === paramId ? { ...param, [field]: value } : param
    );
    
    onConfigUpdate(node.id, { inputs: updatedInputs });
  };
  
  // Delete an input parameter
  const deleteInputParameter = (paramId: string) => {
    if (!node.inputs) return;
    
    onConfigUpdate(node.id, {
      inputs: node.inputs.filter(param => param.id !== paramId)
    });
  };
  
  // Add a new output parameter
  const addOutputParameter = () => {
    const newParam: NodeParameter = {
      id: `param_${Date.now()}`,
      name: 'New Output',
      type: 'string',
      required: false,
      description: 'Output description'
    };
    
    onConfigUpdate(node.id, { 
      outputs: [...(node.outputs || []), newParam]
    });
  };
  
  // Update an output parameter
  const updateOutputParameter = (paramId: string, field: string, value: any) => {
    if (!node.outputs) return;
    
    const updatedOutputs = node.outputs.map(param => 
      param.id === paramId ? { ...param, [field]: value } : param
    );
    
    onConfigUpdate(node.id, { outputs: updatedOutputs });
  };
  
  // Delete an output parameter
  const deleteOutputParameter = (paramId: string) => {
    if (!node.outputs) return;
    
    onConfigUpdate(node.id, {
      outputs: node.outputs.filter(param => param.id !== paramId)
    });
  };
  
  // Add a data mapping
  const addDataMapping = (sourceNodeId: string, sourceParamId: string, targetParamId: string) => {
    const newMapping = {
      sourceNodeId,
      sourceParameterId: sourceParamId,
      targetParameterId: targetParamId
    };
    
    onConfigUpdate(node.id, {
      dataMappings: [...(node.dataMappings || []), newMapping]
    });
  };
  
  // Remove a data mapping
  const removeDataMapping = (sourceNodeId: string, sourceParamId: string, targetParamId: string) => {
    if (!node.dataMappings) return;
    
    onConfigUpdate(node.id, {
      dataMappings: node.dataMappings.filter(mapping => 
        !(mapping.sourceNodeId === sourceNodeId && 
          mapping.sourceParameterId === sourceParamId && 
          mapping.targetParameterId === targetParamId)
      )
    });
  };
  
  // Validate the node configuration
  const validateNode = () => {
    const errors: NodeValidationError[] = [];
    
    // Check if required inputs have values or mappings
    if (node.inputs) {
      node.inputs.forEach(input => {
        if (input.required) {
          const hasMapping = node.dataMappings?.some(m => m.targetParameterId === input.id);
          const hasValue = node.configData && node.configData[input.id] !== undefined;
          
          if (!hasMapping && !hasValue) {
            errors.push({
              paramId: input.id,
              message: `${input.name} is required but has no value or mapping`,
              severity: 'error'
            });
          }
        }
      });
    }
    
    // Check output parameters for conditional nodes
    if (node.type === 'condition' && (!node.outputs || node.outputs.length < 2)) {
      errors.push({
        paramId: 'outputs',
        message: 'Condition nodes require at least two outputs (true/false)',
        severity: 'error'
      });
    }
    
    setValidationErrors(errors);
    onConfigUpdate(node.id, { 
      validationErrors: errors,
      isConfigured: errors.filter(e => e.severity === 'error').length === 0
    });
    
    return errors.length === 0;
  };
  
  // Handle node testing
  const handleTestNode = () => {
    if (validateNode()) {
      onTestNode(node.id);
    }
  };
  
  // Get parameter type label
  const getParameterTypeLabel = (type: string) => {
    switch (type) {
      case 'string': return 'Text';
      case 'number': return 'Number';
      case 'boolean': return 'Yes/No';
      case 'object': return 'Object';
      case 'array': return 'List';
      case 'date': return 'Date';
      default: return type;
    }
  };
  
  return (
    <div className="h-72 border-t bg-white overflow-hidden flex flex-col">
      <div className="p-4 border-b">
        <div className="flex justify-between mb-3">
          <h4 className="font-medium flex items-center gap-2">
            <Icons.settings className="h-4 w-4" />
            {node.title} Configuration
            {node.isConfigured && (
              <Badge className="bg-green-500 text-xs">Configured</Badge>
            )}
          </h4>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onStartConnection(node.id)}
              disabled={isDrawingLine}
            >
              <Icons.arrowRight className="mr-2 h-4 w-4" /> Connect
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleTestNode}
            >
              <Icons.play className="mr-2 h-4 w-4" /> Test
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-500 hover:text-red-600"
              onClick={() => onDeleteNode(node.id)}
            >
              <Icons.trash className="mr-2 h-4 w-4" /> Delete
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="inputs">Inputs & Mappings</TabsTrigger>
            <TabsTrigger value="outputs">Outputs & Testing</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ScrollArea className="flex-1 p-4">
        <TabsContent value="basic" className="m-0">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="node-title">Title</Label>
              <Input 
                id="node-title" 
                value={node.title}
                onChange={(e) => updateBasicInfo('title', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="node-type">Type</Label>
              <Input 
                id="node-type" 
                value={node.type.charAt(0).toUpperCase() + node.type.slice(1)}
                disabled
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <Label htmlFor="node-description">Description</Label>
            <Textarea 
              id="node-description"
              value={node.description}
              onChange={(e) => updateBasicInfo('description', e.target.value)}
              className="mt-1"
              rows={2}
            />
          </div>
          
          <div>
            <Label>Additional Configuration</Label>
            <div className="mt-1 grid grid-cols-1 gap-3">
              {node.type === 'trigger' && (
                <Card>
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-sm">Trigger Settings</CardTitle>
                    <CardDescription className="text-xs">Configure how this workflow is triggered</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="trigger-event" className="text-xs">Event Type</Label>
                        <Select
                          value={node.configData?.triggerEvent || 'manual'}
                          onValueChange={(value) => onConfigUpdate(node.id, {
                            configData: { ...(node.configData || {}), triggerEvent: value }
                          })}
                        >
                          <SelectTrigger className="w-[180px] h-8 text-xs">
                            <SelectValue placeholder="Select event" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manual">Manual Trigger</SelectItem>
                            <SelectItem value="scheduled">Scheduled</SelectItem>
                            <SelectItem value="webhook">Webhook</SelectItem>
                            <SelectItem value="form">Form Submission</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {node.configData?.triggerEvent === 'scheduled' && (
                        <div className="flex items-center justify-between">
                          <Label htmlFor="schedule" className="text-xs">Schedule (cron)</Label>
                          <Input 
                            id="schedule"
                            className="w-[180px] h-8 text-xs"
                            placeholder="0 9 * * 1-5"
                            value={node.configData?.schedule || ''}
                            onChange={(e) => onConfigUpdate(node.id, {
                              configData: { ...(node.configData || {}), schedule: e.target.value }
                            })}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {node.type === 'condition' && (
                <Card>
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-sm">Condition Settings</CardTitle>
                    <CardDescription className="text-xs">Define logic for this conditional branch</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="condition-type" className="text-xs">Condition Type</Label>
                        <Select
                          value={node.configData?.conditionType || 'comparison'}
                          onValueChange={(value) => onConfigUpdate(node.id, {
                            configData: { ...(node.configData || {}), conditionType: value }
                          })}
                        >
                          <SelectTrigger className="w-[180px] h-8 text-xs">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comparison">Comparison</SelectItem>
                            <SelectItem value="expression">Expression</SelectItem>
                            <SelectItem value="custom">Custom Logic</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {node.configData?.conditionType === 'comparison' && (
                        <>
                          <div className="text-xs">Left operand will come from data mapping</div>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="operator" className="text-xs">Operator</Label>
                            <Select
                              value={node.configData?.operator || 'equals'}
                              onValueChange={(value) => onConfigUpdate(node.id, {
                                configData: { ...(node.configData || {}), operator: value }
                              })}
                            >
                              <SelectTrigger className="w-[180px] h-8 text-xs">
                                <SelectValue placeholder="Select operator" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="equals">Equals (=)</SelectItem>
                                <SelectItem value="notEquals">Not Equals (!=)</SelectItem>
                                <SelectItem value="greaterThan">Greater Than (&gt;)</SelectItem>
                                <SelectItem value="lessThan">Less Than (&lt;)</SelectItem>
                                <SelectItem value="contains">Contains</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="right-operand" className="text-xs">Right operand</Label>
                            <Input 
                              id="right-operand"
                              className="w-[180px] h-8 text-xs"
                              placeholder="Value to compare with"
                              value={node.configData?.rightOperand || ''}
                              onChange={(e) => onConfigUpdate(node.id, {
                                configData: { ...(node.configData || {}), rightOperand: e.target.value }
                              })}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {node.type === 'action' && (
                <Card>
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-sm">Action Settings</CardTitle>
                    <CardDescription className="text-xs">Configure this action step</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="action-type" className="text-xs">Action Type</Label>
                        <Select
                          value={node.configData?.actionType || 'api'}
                          onValueChange={(value) => onConfigUpdate(node.id, {
                            configData: { ...(node.configData || {}), actionType: value }
                          })}
                        >
                          <SelectTrigger className="w-[180px] h-8 text-xs">
                            <SelectValue placeholder="Select action" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="api">API Request</SelectItem>
                            <SelectItem value="email">Send Email</SelectItem>
                            <SelectItem value="database">Database Operation</SelectItem>
                            <SelectItem value="transform">Transform Data</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {node.configData?.actionType === 'api' && (
                        <>
                          <div className="flex items-center justify-between">
                            <Label htmlFor="api-method" className="text-xs">HTTP Method</Label>
                            <Select
                              value={node.configData?.apiMethod || 'GET'}
                              onValueChange={(value) => onConfigUpdate(node.id, {
                                configData: { ...(node.configData || {}), apiMethod: value }
                              })}
                            >
                              <SelectTrigger className="w-[180px] h-8 text-xs">
                                <SelectValue placeholder="Select method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="GET">GET</SelectItem>
                                <SelectItem value="POST">POST</SelectItem>
                                <SelectItem value="PUT">PUT</SelectItem>
                                <SelectItem value="DELETE">DELETE</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="api-url" className="text-xs">API URL</Label>
                            <Input 
                              id="api-url"
                              className="w-[180px] h-8 text-xs"
                              placeholder="https://api.example.com"
                              value={node.configData?.apiUrl || ''}
                              onChange={(e) => onConfigUpdate(node.id, {
                                configData: { ...(node.configData || {}), apiUrl: e.target.value }
                              })}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {node.type === 'delay' && (
                <Card>
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-sm">Delay Settings</CardTitle>
                    <CardDescription className="text-xs">Configure waiting period</CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="delay-time" className="text-xs">Delay Duration</Label>
                        <div className="flex items-center space-x-2">
                          <Input 
                            id="delay-time"
                            type="number"
                            className="w-20 h-8 text-xs"
                            placeholder="5"
                            value={node.configData?.delayAmount || '5'}
                            onChange={(e) => onConfigUpdate(node.id, {
                              configData: { ...(node.configData || {}), delayAmount: e.target.value }
                            })}
                          />
                          <Select
                            value={node.configData?.delayUnit || 'minutes'}
                            onValueChange={(value) => onConfigUpdate(node.id, {
                              configData: { ...(node.configData || {}), delayUnit: value }
                            })}
                          >
                            <SelectTrigger className="w-[120px] h-8 text-xs">
                              <SelectValue placeholder="Select unit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="seconds">Seconds</SelectItem>
                              <SelectItem value="minutes">Minutes</SelectItem>
                              <SelectItem value="hours">Hours</SelectItem>
                              <SelectItem value="days">Days</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="inputs" className="m-0">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h5 className="font-medium text-sm">Input Parameters</h5>
              <Button size="sm" variant="outline" onClick={addInputParameter}>
                <Icons.plus className="h-3 w-3 mr-1" /> Add Parameter
              </Button>
            </div>
            
            {(!node.inputs || node.inputs.length === 0) ? (
              <div className="text-center py-4 text-slate-500 text-sm">
                No input parameters defined. Click "Add Parameter" to create one.
              </div>
            ) : (
              <div className="space-y-3">
                {node.inputs.map(input => (
                  <Card key={input.id}>
                    <CardHeader className="p-3 pb-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center">
                          {input.name}
                          {input.required && (
                            <span className="ml-1 text-red-500 text-xs">*</span>
                          )}
                        </CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => deleteInputParameter(input.id)}
                        >
                          <Icons.x className="h-3 w-3" />
                        </Button>
                      </div>
                      <CardDescription className="text-xs flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-normal">
                          {getParameterTypeLabel(input.type)}
                        </Badge>
                        {input.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Parameter Name</Label>
                        <Input 
                          value={input.name}
                          onChange={(e) => updateInputParameter(input.id, 'name', e.target.value)}
                          className="w-44 h-7 text-xs"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Data Type</Label>
                        <Select
                          value={input.type}
                          onValueChange={(value) => updateInputParameter(input.id, 'type', value)}
                        >
                          <SelectTrigger className="w-44 h-7 text-xs">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="string">Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Yes/No</SelectItem>
                            <SelectItem value="object">Object</SelectItem>
                            <SelectItem value="array">List</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Required</Label>
                        <Switch 
                          checked={input.required}
                          onCheckedChange={(checked) => updateInputParameter(input.id, 'required', checked)}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Default Value</Label>
                        <Input 
                          value={input.defaultValue || ''}
                          onChange={(e) => updateInputParameter(input.id, 'defaultValue', e.target.value)}
                          className="w-44 h-7 text-xs"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <h5 className="font-medium text-sm mb-2">Data Mappings</h5>
            
            {!potentialSourceNodes.length ? (
              <div className="text-center py-4 text-slate-500 text-sm">
                Add other nodes to your workflow to create data mappings.
              </div>
            ) : (!node.inputs || node.inputs.length === 0) ? (
              <div className="text-center py-4 text-slate-500 text-sm">
                Add input parameters to create data mappings.
              </div>
            ) : (
              <div className="space-y-3">
                <Card>
                  <CardHeader className="p-3 pb-1">
                    <CardTitle className="text-sm">Map Data from Other Nodes</CardTitle>
                    <CardDescription className="text-xs">
                      Connect outputs from previous nodes to inputs of this node
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 pt-0">
                    <Accordion type="single" collapsible className="w-full">
                      {potentialSourceNodes.map(sourceNode => (
                        <AccordionItem key={sourceNode.id} value={sourceNode.id}>
                          <AccordionTrigger className="py-2 text-sm">
                            {sourceNode.title}
                          </AccordionTrigger>
                          <AccordionContent>
                            {!sourceNode.outputs || sourceNode.outputs.length === 0 ? (
                              <div className="text-xs p-2 text-slate-500">
                                This node has no output parameters to map from.
                              </div>
                            ) : (
                              <div className="space-y-2 p-2">
                                {sourceNode.outputs?.map(output => (
                                  <div key={output.id} className="bg-slate-50 p-2 rounded">
                                    <div className="text-xs font-medium mb-1">
                                      {output.name} ({getParameterTypeLabel(output.type)})
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Label className="text-xs">Map to:</Label>
                                      <Select
                                        onValueChange={(targetId) => 
                                          addDataMapping(sourceNode.id, output.id, targetId)
                                        }
                                      >
                                        <SelectTrigger className="w-44 h-7 text-xs">
                                          <SelectValue placeholder="Select input" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {node.inputs?.map(input => (
                                            <SelectItem key={input.id} value={input.id}>
                                              {input.name} ({getParameterTypeLabel(input.type)})
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
                
                {/* Show current mappings */}
                {node.dataMappings && node.dataMappings.length > 0 && (
                  <Card>
                    <CardHeader className="p-3 pb-1">
                      <CardTitle className="text-sm">Active Mappings</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="space-y-2">
                        {node.dataMappings.map((mapping, index) => {
                          const sourceNode = allNodes.find(n => n.id === mapping.sourceNodeId);
                          const sourceParam = sourceNode?.outputs?.find(p => p.id === mapping.sourceParameterId);
                          const targetParam = node.inputs?.find(p => p.id === mapping.targetParameterId);
                          
                          if (!sourceNode || !sourceParam || !targetParam) return null;
                          
                          return (
                            <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded text-xs">
                              <div>
                                <span className="font-medium">{sourceNode.title}.{sourceParam.name}</span>
                                <Icons.arrowRight className="inline-block mx-1 h-3 w-3" />
                                <span className="font-medium">{node.title}.{targetParam.name}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0 text-red-500"
                                onClick={() => removeDataMapping(mapping.sourceNodeId, mapping.sourceParameterId, mapping.targetParameterId)}
                              >
                                <Icons.x className="h-3 w-3" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="outputs" className="m-0">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h5 className="font-medium text-sm">Output Parameters</h5>
              <Button size="sm" variant="outline" onClick={addOutputParameter}>
                <Icons.plus className="h-3 w-3 mr-1" /> Add Output
              </Button>
            </div>
            
            {(!node.outputs || node.outputs.length === 0) ? (
              <div className="text-center py-4 text-slate-500 text-sm">
                No output parameters defined. Click "Add Output" to create one.
              </div>
            ) : (
              <div className="space-y-3">
                {node.outputs.map(output => (
                  <Card key={output.id}>
                    <CardHeader className="p-3 pb-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm">{output.name}</CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0"
                          onClick={() => deleteOutputParameter(output.id)}
                        >
                          <Icons.x className="h-3 w-3" />
                        </Button>
                      </div>
                      <CardDescription className="text-xs flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-normal">
                          {getParameterTypeLabel(output.type)}
                        </Badge>
                        {output.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 pt-0 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Output Name</Label>
                        <Input 
                          value={output.name}
                          onChange={(e) => updateOutputParameter(output.id, 'name', e.target.value)}
                          className="w-44 h-7 text-xs"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Data Type</Label>
                        <Select
                          value={output.type}
                          onValueChange={(value) => updateOutputParameter(output.id, 'type', value)}
                        >
                          <SelectTrigger className="w-44 h-7 text-xs">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="string">Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="boolean">Yes/No</SelectItem>
                            <SelectItem value="object">Object</SelectItem>
                            <SelectItem value="array">List</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label className="text-xs">Description</Label>
                        <Input 
                          value={output.description || ''}
                          onChange={(e) => updateOutputParameter(output.id, 'description', e.target.value)}
                          className="w-44 h-7 text-xs"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
          
          {/* Test Results Section */}
          <div>
            <h5 className="font-medium text-sm mb-2">Test Results</h5>
            
            {!node.executionResults ? (
              <div className="text-center py-4 text-slate-500 text-sm">
                No test results yet. Configure the node and click "Test" to run a simulation.
              </div>
            ) : (
              <Card>
                <CardHeader className={`p-3 pb-1 ${node.executionResults.success ? 'bg-green-50' : 'bg-red-50'}`}>
                  <CardTitle className="text-sm flex items-center">
                    {node.executionResults.success ? (
                      <>
                        <Icons.checkCircle className="mr-1 h-4 w-4 text-green-500" />
                        <span className="text-green-700">Test Successful</span>
                      </>
                    ) : (
                      <>
                        <Icons.xCircle className="mr-1 h-4 w-4 text-red-500" />
                        <span className="text-red-700">Test Failed</span>
                      </>
                    )}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {node.executionResults.message}
                    {node.executionResults.duration && ` (Completed in ${node.executionResults.duration}ms)`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-1">
                  {node.executionResults.logs && node.executionResults.logs.length > 0 && (
                    <div className="mb-2">
                      <div className="text-xs font-medium mb-1">Execution Logs:</div>
                      <div className="bg-slate-900 text-white p-2 rounded text-xs font-mono">
                        {node.executionResults.logs.map((log, i) => (
                          <div key={i}>{log}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {node.executionResults.data && (
                    <div>
                      <div className="text-xs font-medium mb-1">Output Data:</div>
                      <div className="bg-slate-50 p-2 rounded text-xs font-mono">
                        <pre>{JSON.stringify(node.executionResults.data, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </ScrollArea>
    </div>
  );
}