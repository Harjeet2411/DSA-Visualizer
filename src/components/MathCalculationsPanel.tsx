
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MathCalculationsPanelProps {
  algorithm: string;
  currentCalculation?: {
    formula: string;
    variables: { [key: string]: number | string };
    result: number | string;
    explanation: string;
  };
}

const MathCalculationsPanel = ({ algorithm, currentCalculation }: MathCalculationsPanelProps) => {
  const getAlgorithmFormulas = () => {
    switch (algorithm) {
      case 'dfs':
        return {
          title: 'DFS Complexity Analysis',
          formulas: [
            'Time Complexity: O(V + E)',
            'Space Complexity: O(V)',
            'V = number of vertices, E = number of edges'
          ]
        };
      case 'bfs':
        return {
          title: 'BFS Complexity Analysis', 
          formulas: [
            'Time Complexity: O(V + E)',
            'Space Complexity: O(V)',
            'V = number of vertices, E = number of edges'
          ]
        };
      case 'minimax':
        return {
          title: 'Minimax Value Calculation',
          formulas: [
            'Minimax(node) = max(children) if maximizing player',
            'Minimax(node) = min(children) if minimizing player',
            'Leaf nodes return their utility values'
          ]
        };
      case 'alphabeta':
        return {
          title: 'Alpha-Beta Pruning',
          formulas: [
            'Alpha: best value for maximizing player',
            'Beta: best value for minimizing player', 
            'Prune when Alpha ≥ Beta',
            'Best case: O(b^(d/2)) vs O(b^d) for minimax'
          ]
        };
      default:
        return { title: 'Mathematical Analysis', formulas: [] };
    }
  };

  const { title, formulas } = getAlgorithmFormulas();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {formulas.map((formula, index) => (
            <div key={index} className="bg-gray-50 p-2 rounded font-mono text-sm">
              {formula}
            </div>
          ))}
        </div>

        {currentCalculation && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-700 mb-2">Current Calculation:</h4>
            <div className="bg-blue-50 p-3 rounded-lg space-y-2">
              <div className="font-mono text-sm">{currentCalculation.formula}</div>
              <div className="text-sm text-gray-600">
                Variables: {Object.entries(currentCalculation.variables).map(([key, value]) => 
                  `${key} = ${value}`
                ).join(', ')}
              </div>
              <div className="font-medium">Result: {currentCalculation.result}</div>
              <div className="text-sm text-blue-700">{currentCalculation.explanation}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MathCalculationsPanel;
