
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SkipBack, SkipForward, Rewind, FastForward } from 'lucide-react';

interface StepExplanationPanelProps {
  algorithm: string;
  currentStep: number;
  totalSteps: number;
  stepDescription: string;
  onStepChange: (step: number) => void;
}

const StepExplanationPanel = ({
  algorithm,
  currentStep,
  totalSteps,
  stepDescription,
  onStepChange
}: StepExplanationPanelProps) => {
  const algorithmSteps = {
    dfs: [
      "Initialize stack with start node",
      "Pop node from stack",
      "Mark node as visited",
      "Add unvisited neighbors to stack",
      "Repeat until stack is empty or target found"
    ],
    bfs: [
      "Initialize queue with start node",
      "Dequeue node from front",
      "Mark node as visited", 
      "Add unvisited neighbors to queue",
      "Repeat until queue is empty or target found"
    ],
    minimax: [
      "Start at root node",
      "Evaluate leaf nodes",
      "Propagate values up the tree",
      "Choose optimal move",
      "Continue recursively"
    ],
    alphabeta: [
      "Initialize alpha and beta values",
      "Traverse tree depth-first",
      "Update alpha/beta bounds",
      "Prune branches when alpha >= beta",
      "Return optimal value"
    ]
  };

  const steps = algorithmSteps[algorithm as keyof typeof algorithmSteps] || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Step-by-Step Explanation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Step {currentStep + 1} of {totalSteps}
          </span>
          <div className="flex space-x-1">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onStepChange(0)}
              disabled={currentStep === 0}
            >
              <Rewind className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onStepChange(currentStep - 1)}
              disabled={currentStep === 0}
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onStepChange(currentStep + 1)}
              disabled={currentStep >= totalSteps - 1}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => onStepChange(totalSteps - 1)}
              disabled={currentStep >= totalSteps - 1}
            >
              <FastForward className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-blue-800 font-medium">Current Step:</p>
          <p className="text-blue-700 text-sm">{stepDescription}</p>
        </div>

        <div className="space-y-2">
          <p className="font-medium text-gray-700">Algorithm Steps:</p>
          <ol className="list-decimal list-inside space-y-1">
            {steps.map((step, index) => (
              <li 
                key={index}
                className={`text-sm ${
                  index === currentStep % steps.length 
                    ? 'text-blue-600 font-medium bg-blue-50 p-1 rounded' 
                    : 'text-gray-600'
                }`}
              >
                {step}
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepExplanationPanel;
