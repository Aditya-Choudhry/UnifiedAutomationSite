import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";

// Define types for workflow nodes
export type NodeType = 'trigger' | 'action' | 'condition' | 'delay' | 'data';

// Define input/output parameter types for data mapping
export type ParameterType = 'string' | 'number' | 'boolean' | 'object' | 'array' | 'date';

export interface NodeParameter {
  id: string;
  name: string;
  type: ParameterType;
  required: boolean;
  description?: string;
  defaultValue?: any;
  options?: { label: string; value: any }[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    customValidation?: (value: any) => boolean;
  };
}

export interface NodeDataMapping {
  sourceNodeId: string;
  sourceParameterId: string;
  targetParameterId: string;
}

export interface NodeValidationError {
  paramId: string;
  message: string;
  severity: 'warning' | 'error';
}

export interface NodeData {
  id: string;
  type: NodeType;
  title: string;
  description: string;
  icon: keyof typeof Icons;
  connectedTo?: string[];
  position?: { x: number; y: number };
  configData?: Record<string, any>;
  // Enhanced configuration data
  inputs?: NodeParameter[];
  outputs?: NodeParameter[];
  dataMappings?: NodeDataMapping[];
  status?: 'idle' | 'running' | 'success' | 'error';
  validationErrors?: NodeValidationError[];
  isConfigured?: boolean;
  lastExecuted?: string;
  executionResults?: {
    success: boolean;
    message?: string;
    data?: any;
    logs?: string[];
    duration?: number;
  };
}

interface WorkflowNodeProps {
  node: NodeData;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onDragStart?: (e: React.DragEvent, nodeType: NodeType, nodeId?: string) => void;
  isDraggable?: boolean;
}

const getNodeColor = (type: NodeType) => {
  switch (type) {
    case 'trigger':
      return 'bg-blue-50 border-blue-200';
    case 'action':
      return 'bg-emerald-50 border-emerald-200';
    case 'condition':
      return 'bg-amber-50 border-amber-200';
    case 'delay':
      return 'bg-purple-50 border-purple-200';
    case 'data':
      return 'bg-slate-50 border-slate-200';
    default:
      return 'bg-slate-50 border-slate-200';
  }
};

export const getNodeBadgeColor = (type: NodeType) => {
  switch (type) {
    case 'trigger':
      return 'bg-blue-500';
    case 'action':
      return 'bg-emerald-500';
    case 'condition':
      return 'bg-amber-500';
    case 'delay':
      return 'bg-purple-500';
    case 'data':
      return 'bg-slate-500';
    default:
      return 'bg-slate-500';
  }
};

export default function WorkflowNode({ 
  node, 
  isSelected = false, 
  onSelect, 
  onDragStart,
  isDraggable = false
}: WorkflowNodeProps) {
  const IconComponent = Icons[node.icon] || Icons.activity;
  
  const handleDragStart = (e: React.DragEvent) => {
    if (isDraggable && onDragStart) {
      onDragStart(e, node.type, node.id);
    }
  };
  
  // Determine node status indicator color
  const getStatusColor = () => {
    if (!node.status || node.status === 'idle') return 'bg-slate-300';
    switch (node.status) {
      case 'running': return 'bg-amber-500 animate-pulse';
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-slate-300';
    }
  };
  
  // Determine if node has validation issues
  const hasValidationErrors = node.validationErrors && node.validationErrors.some(e => e.severity === 'error');
  const hasValidationWarnings = node.validationErrors && node.validationErrors.some(e => e.severity === 'warning');
  
  return (
    <Card 
      className={`w-full border ${getNodeColor(node.type)} hover:shadow-md transition cursor-pointer ${
        isSelected ? 'ring-2 ring-primary-500 shadow-md' : ''
      } ${hasValidationErrors ? 'border-red-300' : ''}`}
      onClick={() => onSelect && onSelect(node.id)}
      draggable={isDraggable}
      onDragStart={handleDragStart}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-start space-y-0 gap-3">
        <div className={`p-2 rounded-md ${getNodeBadgeColor(node.type)} text-white relative`}>
          <IconComponent className="h-5 w-5" />
          {/* Status indicator */}
          <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${getStatusColor()} ring-1 ring-white`}></div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h3 className="font-medium text-base">{node.title}</h3>
              {hasValidationErrors && (
                <div className="ml-2 text-red-500" title="Configuration errors">
                  <Icons.alertCircle className="h-4 w-4" />
                </div>
              )}
              {hasValidationWarnings && !hasValidationErrors && (
                <div className="ml-2 text-amber-500" title="Configuration warnings">
                  <Icons.alertTriangle className="h-4 w-4" />
                </div>
              )}
              {node.isConfigured && !hasValidationErrors && !hasValidationWarnings && (
                <div className="ml-2 text-green-500" title="Properly configured">
                  <Icons.checkCircle className="h-4 w-4" />
                </div>
              )}
            </div>
            <Badge className={getNodeBadgeColor(node.type)}>
              {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">{node.description}</p>
          
          {/* Show execution results summary if available */}
          {node.executionResults && (
            <div className={`mt-1 text-xs rounded px-1.5 py-0.5 font-medium ${
              node.executionResults.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {node.executionResults.success ? 'Executed successfully' : 'Execution failed'}
              {node.executionResults.duration && ` (${node.executionResults.duration}ms)`}
            </div>
          )}
        </div>
      </CardHeader>
      
      {/* Configuration data summary */}
      {node.configData && Object.keys(node.configData).length > 0 && (
        <CardContent className="p-4 pt-0">
          <div className="text-xs bg-white p-2 rounded border border-slate-100 mt-2">
            {Object.entries(node.configData).map(([key, value]) => (
              <div key={key} className="flex justify-between py-1">
                <span className="text-slate-500">{key}:</span>
                <span className="font-medium truncate ml-2">{String(value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      )}
      
      {/* Show validation errors in error case */}
      {hasValidationErrors && (
        <CardContent className="pt-0 px-4 pb-2">
          <div className="text-xs bg-red-50 p-2 rounded border border-red-100 text-red-700">
            {node.validationErrors?.filter(e => e.severity === 'error').map((error, i) => (
              <div key={i} className="py-0.5">
                <Icons.alertCircle className="inline-block h-3 w-3 mr-1" />
                {error.message}
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}