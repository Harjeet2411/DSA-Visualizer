
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ExplorationStep {
  step: number;
  currentNode: string;
  queueState?: string[];
  stackState?: string[];
  pathDecision: string;
  heuristicValue?: number;
  costValue?: number;
}

interface ExplorationTableProps {
  algorithm: string;
  steps: ExplorationStep[];
  currentStep: number;
}

const ExplorationTable = ({ algorithm, steps, currentStep }: ExplorationTableProps) => {
  const getDataStructureLabel = () => {
    switch (algorithm) {
      case 'dfs': return 'Stack State';
      case 'bfs': return 'Queue State';
      case 'minimax':
      case 'alphabeta': return 'Node Values';
      default: return 'Data Structure';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Step-by-Step Exploration Log</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-64 overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Step</TableHead>
                <TableHead>Current Node</TableHead>
                <TableHead>{getDataStructureLabel()}</TableHead>
                <TableHead>Path Decision</TableHead>
                {(algorithm === 'minimax' || algorithm === 'alphabeta') && (
                  <TableHead>Value</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {steps.map((step, index) => (
                <TableRow 
                  key={step.step}
                  className={index === currentStep ? 'bg-blue-50' : ''}
                >
                  <TableCell className="font-medium">{step.step}</TableCell>
                  <TableCell>{step.currentNode}</TableCell>
                  <TableCell>
                    {algorithm === 'dfs' 
                      ? `[${step.stackState?.join(', ') || ''}]`
                      : algorithm === 'bfs' 
                        ? `[${step.queueState?.join(', ') || ''}]`
                        : step.heuristicValue || step.costValue || '-'
                    }
                  </TableCell>
                  <TableCell>{step.pathDecision}</TableCell>
                  {(algorithm === 'minimax' || algorithm === 'alphabeta') && (
                    <TableCell>{step.costValue || '-'}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExplorationTable;
