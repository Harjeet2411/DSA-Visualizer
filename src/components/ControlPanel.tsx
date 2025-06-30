
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Settings } from 'lucide-react';

interface Node {
  id: string;
  x: number;
  y: number;
  value: number;
}

interface ControlPanelProps {
  algorithm: string;
  startNode: string;
  targetNode: string;
  speed: number;
  nodes: Node[];
  onStartNodeChange: (nodeId: string) => void;
  onTargetNodeChange: (nodeId: string) => void;
  onSpeedChange: (speed: number) => void;
}

const ControlPanel = ({
  algorithm,
  startNode,
  targetNode,
  speed,
  nodes,
  onStartNodeChange,
  onTargetNodeChange,
  onSpeedChange
}: ControlPanelProps) => {
  const algorithmDescriptions = {
    dfs: "Explores as far as possible along each branch before backtracking using a stack (LIFO).",
    bfs: "Explores all neighbors at the current depth before moving to nodes at the next depth using a queue (FIFO).",
    minimax: "Evaluates game tree to find the optimal move assuming both players play optimally.",
    alphabeta: "Optimized minimax that prunes branches that cannot possibly influence the final decision."
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Algorithm Controls</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Algorithm Description */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            {algorithmDescriptions[algorithm as keyof typeof algorithmDescriptions]}
          </p>
        </div>

        {/* Node Selection */}
        {(algorithm === 'dfs' || algorithm === 'bfs') && (
          <>
            <div className="space-y-2">
              <Label htmlFor="start-node">Start Node</Label>
              <Select value={startNode} onValueChange={onStartNodeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {nodes.map(node => (
                    <SelectItem key={node.id} value={node.id}>
                      Node {node.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-node">Target Node</Label>
              <Select value={targetNode} onValueChange={onTargetNodeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {nodes.map(node => (
                    <SelectItem key={node.id} value={node.id}>
                      Node {node.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Speed Control */}
        <div className="space-y-3">
          <Label htmlFor="speed">Animation Speed</Label>
          <div className="space-y-2">
            <Slider
              value={[speed]}
              onValueChange={(value) => onSpeedChange(value[0])}
              max={2000}
              min={100}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Fast</span>
              <span>{speed}ms</span>
              <span>Slow</span>
            </div>
          </div>
        </div>

        {/* Algorithm-specific controls */}
        {(algorithm === 'minimax' || algorithm === 'alphabeta') && (
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Game Tree Mode:</strong> Nodes represent game states. 
              Values show the minimax evaluation.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
