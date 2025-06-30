
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TooltipWrapperProps {
  children: React.ReactNode;
  content: {
    nodeId?: string;
    visited?: boolean;
    cost?: number;
    parent?: string;
    heuristic?: number;
    distance?: number;
    [key: string]: any;
  };
}

const TooltipWrapper = ({ children, content }: TooltipWrapperProps) => {
  const formatTooltipContent = () => {
    const lines: string[] = [];
    
    if (content.nodeId) lines.push(`Node: ${content.nodeId}`);
    if (content.visited !== undefined) lines.push(`Visited: ${content.visited ? 'Yes' : 'No'}`);
    if (content.cost !== undefined) lines.push(`Cost: ${content.cost}`);
    if (content.heuristic !== undefined) lines.push(`Heuristic: ${content.heuristic}`);
    if (content.distance !== undefined) lines.push(`Distance: ${content.distance}`);
    if (content.parent) lines.push(`Parent: ${content.parent}`);
    
    return lines;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            {formatTooltipContent().map((line, index) => (
              <div key={index} className="text-sm">{line}</div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipWrapper;
