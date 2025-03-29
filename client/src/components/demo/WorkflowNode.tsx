import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/lib/icons";

// Define types for workflow nodes
export type NodeType = 'trigger' | 'action' | 'condition' | 'delay' | 'data';

export interface NodeData {
  id: string;
  type: NodeType;
  title: string;
  description: string;
  icon: keyof typeof Icons;
  connectedTo?: string[];
  position?: { x: number; y: number };
  configData?: Record<string, any>;
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

const getNodeBadgeColor = (type: NodeType) => {
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

  return (
    <Card 
      className={`w-full border ${getNodeColor(node.type)} hover:shadow-md transition cursor-pointer ${
        isSelected ? 'ring-2 ring-primary-500 shadow-md' : ''
      }`}
      onClick={() => onSelect && onSelect(node.id)}
      draggable={isDraggable}
      onDragStart={handleDragStart}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-start space-y-0 gap-3">
        <div className={`p-2 rounded-md ${getNodeBadgeColor(node.type)} text-white`}>
          <IconComponent className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-base">{node.title}</h3>
            <Badge className={getNodeBadgeColor(node.type)}>
              {node.type.charAt(0).toUpperCase() + node.type.slice(1)}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">{node.description}</p>
        </div>
      </CardHeader>
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
    </Card>
  );
}