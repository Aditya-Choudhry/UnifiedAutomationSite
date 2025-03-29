import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/lib/icons";
import { NodeData } from './WorkflowNode';
import { useWebSocket } from '@/hooks/use-websocket';

interface WorkflowTesterProps {
  workflowName: string;
  workflowDescription: string;
  nodes: NodeData[];
  onRunWorkflow: () => void;
  onNodeStatusUpdate: (nodeId: string, status: 'idle' | 'running' | 'success' | 'error') => void;
  onNodeExecutionComplete: (nodeId: string, results: any) => void;
}

export default function WorkflowTester({
  workflowName,
  workflowDescription,
  nodes,
  onRunWorkflow,
  onNodeStatusUpdate,
  onNodeExecutionComplete
}: WorkflowTesterProps) {
  const [activeTab, setActiveTab] = useState('logs');
  const [testName, setTestName] = useState(`Test Run - ${new Date().toLocaleTimeString()}`);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [executionResults, setExecutionResults] = useState<Record<string, any>>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [errorNodeId, setErrorNodeId] = useState<string | null>(null);
  
  const logsEndRef = useRef<HTMLDivElement>(null);
  
  // WebSocket for real-time updates
  const { status: wsStatus, sendMessage, lastMessage } = useWebSocket({
    onMessage: (data) => {
      if (data.type === 'workflow_execution_update') {
        handleExecutionUpdate(data);
      }
    }
  });
  
  // Handle execution updates from WebSocket
  const handleExecutionUpdate = (data: any) => {
    if (!isRunning) return;
    
    const { nodeId, status, log, results } = data;
    
    // Add to logs
    if (log) {
      addLog(log);
    }
    
    // Update node status
    if (nodeId && status) {
      onNodeStatusUpdate(nodeId, status);
      setCurrentNodeId(nodeId);
      
      if (status === 'error') {
        setErrorNodeId(nodeId);
      }
      
      // Store execution results
      if (results) {
        setExecutionResults(prev => ({
          ...prev,
          [nodeId]: results
        }));
        onNodeExecutionComplete(nodeId, results);
      }
      
      // Check if workflow is complete
      if (status === 'success' && 
          data.isLastNode && 
          data.workflowStatus === 'completed') {
        handleExecutionComplete();
      }
    }
  };
  
  // Scroll to bottom of logs when new log added
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [testLogs]);
  
  // Add a log entry
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };
  
  // Start workflow execution
  const startExecution = () => {
    if (nodes.length === 0) {
      addLog('Error: No nodes in workflow to execute');
      return;
    }
    
    // Check if all required configs are set
    const unconfiguredNodes = nodes.filter(node => 
      node.validationErrors?.some(e => e.severity === 'error')
    );
    
    if (unconfiguredNodes.length > 0) {
      addLog(`Error: ${unconfiguredNodes.length} nodes have configuration errors that must be fixed before execution`);
      unconfiguredNodes.forEach(node => {
        addLog(`- ${node.title}: Has validation errors`);
      });
      return;
    }
    
    // Start execution
    setIsRunning(true);
    setIsComplete(false);
    setErrorNodeId(null);
    setCurrentNodeId(null);
    setExecutionResults({});
    setTestLogs([]);
    setStartTime(Date.now());
    setEndTime(null);
    
    addLog(`Starting execution of workflow "${workflowName}"`);
    
    // Simulate sending message to server to start workflow
    if (wsStatus === 'open') {
      sendMessage({
        type: 'workflow_execute',
        workflowId: 'demo-workflow',
        testName: testName,
        nodes: nodes.map(n => ({ id: n.id, type: n.type }))
      });
    }
    
    // In demo mode, simulate execution with timeouts
    simulateExecution();
    
    // Call parent handler
    onRunWorkflow();
  };
  
  // Simulate workflow execution
  const simulateExecution = () => {
    // Find all trigger nodes first
    const triggerNodes = nodes.filter(n => n.type === 'trigger');
    if (triggerNodes.length === 0) {
      addLog('Error: No trigger node found in workflow');
      setIsRunning(false);
      return;
    }
    
    // Start with trigger nodes
    triggerNodes.forEach((triggerNode, index) => {
      setTimeout(() => {
        addLog(`Executing trigger: ${triggerNode.title}`);
        onNodeStatusUpdate(triggerNode.id, 'running');
        setCurrentNodeId(triggerNode.id);
        
        // After short delay, mark as success and continue to connected nodes
        setTimeout(() => {
          onNodeStatusUpdate(triggerNode.id, 'success');
          const results = simulateNodeResults(triggerNode);
          setExecutionResults(prev => ({
            ...prev,
            [triggerNode.id]: results
          }));
          onNodeExecutionComplete(triggerNode.id, results);
          addLog(`Trigger ${triggerNode.title} executed successfully`);
          
          // Proceed with connected nodes
          processConnectedNodes(triggerNode);
        }, 1500);
      }, index * 500);
    });
  };
  
  // Process connected nodes in sequence
  const processConnectedNodes = (sourceNode: NodeData, depth = 0, path: string[] = []) => {
    if (!sourceNode.connectedTo || sourceNode.connectedTo.length === 0 || depth > 20) {
      // No more connections or max depth reached
      if (depth > 20) {
        addLog('Warning: Maximum workflow depth reached, execution stopped');
      }
      return;
    }
    
    // Add current node to path to detect cycles
    const currentPath = [...path, sourceNode.id];
    
    // Process each connected node
    sourceNode.connectedTo.forEach((targetId, index) => {
      const targetNode = nodes.find(n => n.id === targetId);
      if (!targetNode) return;
      
      // Detect cycles - skip if node already in path
      if (currentPath.includes(targetId)) {
        addLog(`Warning: Cycle detected in workflow at node ${targetNode.title}, skipping`);
        return;
      }
      
      setTimeout(() => {
        // Check if we should continue (based on conditions for condition nodes)
        let shouldContinue = true;
        if (sourceNode.type === 'condition') {
          // For condition nodes, simulate branching based on configured condition
          const conditionResult = evaluateCondition(sourceNode);
          if (index === 0) {
            // First connection is for true branch
            shouldContinue = conditionResult;
            addLog(`Condition ${sourceNode.title} evaluated to ${conditionResult ? 'TRUE' : 'FALSE'}`);
          } else {
            // Second connection is for false branch
            shouldContinue = !conditionResult;
          }
        }
        
        if (shouldContinue) {
          addLog(`Executing: ${targetNode.title}`);
          onNodeStatusUpdate(targetId, 'running');
          setCurrentNodeId(targetId);
          
          // Create delay based on node type
          const executionDelay = targetNode.type === 'delay' ? 3000 : 2000;
          
          // Randomly fail some nodes for demo (only non-critical ones)
          const shouldFail = targetNode.type !== 'trigger' && Math.random() < 0.1;
          
          setTimeout(() => {
            if (shouldFail) {
              onNodeStatusUpdate(targetId, 'error');
              setErrorNodeId(targetId);
              addLog(`Error: ${targetNode.title} execution failed`);
              
              const errorResults = {
                success: false,
                message: 'Execution failed due to an error',
                logs: [
                  'Error occurred during execution',
                  'Connection timeout or server error',
                  'Check node configuration and try again'
                ]
              };
              
              setExecutionResults(prev => ({
                ...prev,
                [targetId]: errorResults
              }));
              
              onNodeExecutionComplete(targetId, errorResults);
              
              // Stop execution after error
              handleExecutionComplete(true);
            } else {
              onNodeStatusUpdate(targetId, 'success');
              const results = simulateNodeResults(targetNode);
              setExecutionResults(prev => ({
                ...prev,
                [targetId]: results
              }));
              onNodeExecutionComplete(targetId, results);
              addLog(`${targetNode.title} executed successfully`);
              
              // Process next level of connected nodes
              processConnectedNodes(targetNode, depth + 1, currentPath);
            }
          }, executionDelay);
        } else {
          addLog(`Skipping: ${targetNode.title} (condition path not taken)`);
        }
      }, (index + 1) * 800);
    });
    
    // If this is the last node (no more connections), mark workflow as complete
    if (sourceNode.connectedTo.length === 0 && isLastNodeInFlow(sourceNode)) {
      setTimeout(() => {
        handleExecutionComplete();
      }, 1500);
    }
  };
  
  // Check if this node is the last in the execution flow
  const isLastNodeInFlow = (node: NodeData): boolean => {
    if (!node.connectedTo || node.connectedTo.length === 0) {
      // Check if any other nodes have connections
      const otherNodesWithConnections = nodes.filter(n => 
        n.id !== node.id && n.connectedTo && n.connectedTo.length > 0
      );
      return otherNodesWithConnections.length === 0;
    }
    return false;
  };
  
  // Simulate condition evaluation
  const evaluateCondition = (node: NodeData): boolean => {
    if (!node.configData) return Math.random() > 0.5;
    
    const { conditionType, operator, rightOperand } = node.configData;
    
    // Always return true for demo purposes, but in real implementation
    // would compare left and right operands with the selected operator
    return Math.random() > 0.3;
  };
  
  // Simulate node execution results based on node type
  const simulateNodeResults = (node: NodeData) => {
    const baseResult = {
      success: true,
      message: `${node.title} executed successfully`,
      logs: [`Started execution of ${node.title}`, `Completed ${node.title}`],
      duration: Math.floor(Math.random() * 1000) + 100
    };
    
    switch (node.type) {
      case 'trigger':
        return {
          ...baseResult,
          data: {
            triggerId: `trig_${Math.random().toString(36).substring(2, 10)}`,
            timestamp: new Date().toISOString(),
            event: node.configData?.triggerEvent || 'manual'
          }
        };
        
      case 'action':
        if (node.configData?.actionType === 'api') {
          return {
            ...baseResult,
            data: {
              statusCode: 200,
              responseTime: baseResult.duration,
              response: {
                success: true,
                id: `res_${Math.random().toString(36).substring(2, 10)}`,
                timestamp: new Date().toISOString()
              }
            }
          };
        } else if (node.configData?.actionType === 'email') {
          return {
            ...baseResult,
            data: {
              messageId: `msg_${Math.random().toString(36).substring(2, 10)}`,
              recipients: 1,
              status: 'sent'
            }
          };
        }
        return {
          ...baseResult,
          data: {
            actionId: `act_${Math.random().toString(36).substring(2, 10)}`,
            status: 'completed'
          }
        };
        
      case 'condition':
        return {
          ...baseResult,
          data: {
            evaluated: true,
            result: Math.random() > 0.3,
            condition: node.configData?.conditionType || 'comparison'
          }
        };
        
      case 'delay':
        return {
          ...baseResult,
          data: {
            delayAmount: node.configData?.delayAmount || 5,
            delayUnit: node.configData?.delayUnit || 'minutes',
            resumedAt: new Date().toISOString()
          }
        };
        
      default:
        return baseResult;
    }
  };
  
  // Handle workflow completion
  const handleExecutionComplete = (hasError = false) => {
    setIsRunning(false);
    setIsComplete(true);
    setEndTime(Date.now());
    
    if (hasError) {
      addLog('Workflow execution failed due to an error');
    } else {
      addLog('Workflow execution completed successfully');
    }
  };
  
  // Format execution time
  const formatExecutionTime = () => {
    if (!startTime || !endTime) return '--';
    const durationMs = endTime - startTime;
    
    if (durationMs < 1000) {
      return `${durationMs}ms`;
    } else {
      const seconds = durationMs / 1000;
      return seconds < 60 ? `${seconds.toFixed(2)}s` : `${Math.floor(seconds / 60)}m ${Math.floor(seconds % 60)}s`;
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b bg-slate-50">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-medium text-lg">{workflowName}</h3>
            <p className="text-sm text-slate-500">{workflowDescription || 'No description'}</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div>
              <Label htmlFor="test-name" className="text-xs block mb-1">Test Run Name</Label>
              <Input 
                id="test-name"
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                className="h-8 text-sm w-60"
                disabled={isRunning}
              />
            </div>
            
            <Button 
              onClick={startExecution} 
              disabled={isRunning || nodes.length === 0}
              className="mt-5"
            >
              {isRunning ? (
                <>
                  <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Icons.play className="mr-2 h-4 w-4" />
                  Run Workflow
                </>
              )}
            </Button>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge className={`${isRunning ? 'bg-amber-500' : isComplete ? (errorNodeId ? 'bg-red-500' : 'bg-green-500') : 'bg-slate-500'}`}>
            {isRunning ? 'Running' : isComplete ? (errorNodeId ? 'Failed' : 'Completed') : 'Ready'}
          </Badge>
          
          {nodes.length > 0 ? (
            <span className="text-sm text-slate-600">
              {nodes.length} nodes in workflow
            </span>
          ) : (
            <span className="text-sm text-red-500">
              No nodes in workflow
            </span>
          )}
          
          {startTime && (
            <span className="text-sm text-slate-600">
              Started: {new Date(startTime).toLocaleTimeString()}
            </span>
          )}
          
          {isComplete && endTime && (
            <span className="text-sm text-slate-600">
              Duration: {formatExecutionTime()}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          <div className="border-b bg-white">
            <TabsList className="w-full justify-start pl-4 pt-2">
              <TabsTrigger value="logs" className="relative">
                Execution Logs
                {isRunning && <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>}
              </TabsTrigger>
              <TabsTrigger value="data">Output Data</TabsTrigger>
              <TabsTrigger value="visual">Visual Execution</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="logs" className="m-0 p-4 flex-1 overflow-auto">
            <ScrollArea className="h-full relative">
              <div className="space-y-1 font-mono text-xs">
                {testLogs.length > 0 ? (
                  testLogs.map((log, i) => (
                    <div key={i} className="py-1 border-b border-slate-100">
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    {isRunning ? (
                      <div className="animate-pulse">Waiting for logs...</div>
                    ) : (
                      <div>Run the workflow to see execution logs</div>
                    )}
                  </div>
                )}
                <div ref={logsEndRef} />
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="data" className="m-0 p-4 flex-1 overflow-auto">
            <ScrollArea className="h-full">
              {Object.keys(executionResults).length > 0 ? (
                <div className="space-y-4">
                  {nodes.map(node => {
                    const results = executionResults[node.id];
                    if (!results) return null;
                    
                    return (
                      <Card key={node.id} className={results.success ? 'border-green-200' : 'border-red-200'}>
                        <CardHeader className="py-3">
                          <CardTitle className="text-base flex items-center gap-2">
                            {node.title}
                            <Badge variant="outline" className="font-normal">
                              {node.type}
                            </Badge>
                            {results.success ? (
                              <Badge className="bg-green-500 text-xs">Success</Badge>
                            ) : (
                              <Badge className="bg-red-500 text-xs">Failed</Badge>
                            )}
                          </CardTitle>
                          <CardDescription>{results.message}</CardDescription>
                        </CardHeader>
                        <CardContent className="py-0">
                          {results.data && (
                            <div className="bg-slate-50 p-3 rounded-md">
                              <div className="font-medium text-sm mb-1">Output Data:</div>
                              <pre className="text-xs overflow-x-auto">
                                {JSON.stringify(results.data, null, 2)}
                              </pre>
                            </div>
                          )}
                        </CardContent>
                        {results.logs && results.logs.length > 0 && (
                          <CardFooter className="pt-0 pb-3">
                            <div className="w-full">
                              <div className="font-medium text-sm mb-1">Execution Logs:</div>
                              <div className="text-xs space-y-1">
                                {results.logs.map((log: string, i: number) => (
                                  <div key={i} className="text-slate-700">{log}</div>
                                ))}
                              </div>
                            </div>
                          </CardFooter>
                        )}
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  {isRunning ? (
                    <div className="animate-pulse">Waiting for execution data...</div>
                  ) : (
                    <div>Run the workflow to see execution results</div>
                  )}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="visual" className="m-0 p-4 flex-1 overflow-auto">
            <div className="h-full flex items-center justify-center">
              <Card className="w-full max-w-lg">
                <CardHeader>
                  <CardTitle className="text-lg">Visual Execution Path</CardTitle>
                  <CardDescription>
                    See the execution flow through your workflow nodes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isRunning || isComplete ? (
                    <div className="space-y-4">
                      {nodes.map((node, index) => {
                        // Get execution state
                        const isRunningNode = isRunning && currentNodeId === node.id;
                        const hasExecuted = !!executionResults[node.id];
                        const hasSucceeded = hasExecuted && executionResults[node.id].success;
                        const hasFailed = hasExecuted && !executionResults[node.id].success;
                        
                        return (
                          <div key={node.id} className="relative">
                            {/* Connector line */}
                            {index < nodes.length - 1 && (
                              <div className={`absolute left-3 top-10 bottom-0 w-0.5 ${
                                hasExecuted ? (hasSucceeded ? 'bg-green-500' : 'bg-red-500') : 'bg-slate-200'
                              }`}></div>
                            )}
                            
                            <div className={`flex items-start gap-3 ${index < nodes.length - 1 ? 'pb-4' : ''}`}>
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                isRunningNode ? 'bg-amber-500 animate-pulse' :
                                hasSucceeded ? 'bg-green-500' :
                                hasFailed ? 'bg-red-500' :
                                'bg-slate-200'
                              }`}>
                                {hasSucceeded ? (
                                  <Icons.check className="h-3 w-3 text-white" />
                                ) : hasFailed ? (
                                  <Icons.x className="h-3 w-3 text-white" />
                                ) : isRunningNode ? (
                                  <Icons.loader className="h-3 w-3 text-white animate-spin" />
                                ) : (
                                  <span className="text-xs text-white">{index + 1}</span>
                                )}
                              </div>
                              
                              <div className="flex-1">
                                <div className="font-medium">{node.title}</div>
                                <div className="text-sm text-slate-500">{node.type}</div>
                                
                                {hasExecuted && (
                                  <div className="mt-1 text-xs">
                                    {executionResults[node.id].duration && (
                                      <span className="text-slate-500">
                                        Duration: {executionResults[node.id].duration}ms
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              {isRunningNode && (
                                <Badge className="bg-amber-500 animate-pulse">Running</Badge>
                              )}
                              {hasSucceeded && (
                                <Badge className="bg-green-500">Success</Badge>
                              )}
                              {hasFailed && (
                                <Badge className="bg-red-500">Failed</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      Run the workflow to see execution visualization
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}