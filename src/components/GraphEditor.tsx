
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Edit3, Plus, Trash2, Shuffle } from 'lucide-react';

interface Node {
  id: string;
  x: number;
  y: number;
  value: number;
}

interface Edge {
  from: string;
  to: string;
  weight: number;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

interface GraphEditorProps {
  graphData: GraphData;
  onGraphChange: (data: GraphData) => void;
  disabled: boolean;
}

const GraphEditor = ({ graphData, onGraphChange, disabled }: GraphEditorProps) => {
  const [newNodeId, setNewNodeId] = useState('');
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [edgeFrom, setEdgeFrom] = useState('');
  const [edgeTo, setEdgeTo] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('1');

  const addNode = () => {
    if (!newNodeId || graphData.nodes.find(n => n.id === newNodeId)) return;

    const newNode: Node = {
      id: newNodeId,
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50,
      value: 0
    };

    onGraphChange({
      ...graphData,
      nodes: [...graphData.nodes, newNode]
    });

    setNewNodeId('');
  };

  const removeNode = (nodeId: string) => {
    onGraphChange({
      nodes: graphData.nodes.filter(n => n.id !== nodeId),
      edges: graphData.edges.filter(e => e.from !== nodeId && e.to !== nodeId)
    });
  };

  const addEdge = () => {
    if (!edgeFrom || !edgeTo || edgeFrom === edgeTo) return;
    if (graphData.edges.find(e => e.from === edgeFrom && e.to === edgeTo)) return;

    const newEdge: Edge = {
      from: edgeFrom,
      to: edgeTo,
      weight: parseInt(edgeWeight) || 1
    };

    onGraphChange({
      ...graphData,
      edges: [...graphData.edges, newEdge]
    });

    setEdgeFrom('');
    setEdgeTo('');
    setEdgeWeight('1');
  };

  const removeEdge = (from: string, to: string) => {
    onGraphChange({
      ...graphData,
      edges: graphData.edges.filter(e => !(e.from === from && e.to === to))
    });
  };

  const generateRandomGraph = () => {
    const nodeIds = ['A', 'B', 'C', 'D', 'E', 'F'];
    const nodeCount = Math.floor(Math.random() * 4) + 3; // 3-6 nodes
    
    const nodes: Node[] = nodeIds.slice(0, nodeCount).map((id, index) => ({
      id,
      x: (index % 3) * 120 + 80,
      y: Math.floor(index / 3) * 100 + 80,
      value: Math.floor(Math.random() * 10)
    }));

    const edges: Edge[] = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.5) {
          edges.push({
            from: nodes[i].id,
            to: nodes[j].id,
            weight: Math.floor(Math.random() * 5) + 1
          });
        }
      }
    }

    onGraphChange({ nodes, edges });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Edit3 className="w-5 h-5" />
          <span>Graph Editor</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generateRandomGraph}
            disabled={disabled}
            className="w-full flex items-center space-x-2"
          >
            <Shuffle className="w-4 h-4" />
            <span>Generate Random Graph</span>
          </Button>
        </div>

        {/* Add Node */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Add Node</Label>
          <div className="flex space-x-2">
            <Input
              placeholder="Node ID"
              value={newNodeId}
              onChange={(e) => setNewNodeId(e.target.value.toUpperCase())}
              disabled={disabled}
              className="flex-1"
            />
            <Button
              size="sm"
              onClick={addNode}
              disabled={disabled || !newNodeId}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Current Nodes */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Current Nodes</Label>
          <div className="flex flex-wrap gap-2">
            {graphData.nodes.map(node => (
              <div key={node.id} className="flex items-center space-x-1">
                <Badge variant="secondary" className="text-xs">
                  {node.id}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeNode(node.id)}
                  disabled={disabled}
                  className="h-6 w-6 p-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Edge */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Add Edge</Label>
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="From"
              value={edgeFrom}
              onChange={(e) => setEdgeFrom(e.target.value.toUpperCase())}
              disabled={disabled}
            />
            <Input
              placeholder="To"
              value={edgeTo}
              onChange={(e) => setEdgeTo(e.target.value.toUpperCase())}
              disabled={disabled}
            />
            <Input
              placeholder="Weight"
              value={edgeWeight}
              onChange={(e) => setEdgeWeight(e.target.value)}
              disabled={disabled}
              type="number"
            />
          </div>
          <Button
            size="sm"
            onClick={addEdge}
            disabled={disabled || !edgeFrom || !edgeTo}
            className="w-full"
          >
            Add Edge
          </Button>
        </div>

        {/* Current Edges */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Current Edges</Label>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {graphData.edges.map((edge, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {edge.from} → {edge.to} ({edge.weight})
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeEdge(edge.from, edge.to)}
                  disabled={disabled}
                  className="h-6 w-6 p-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {disabled && (
          <div className="p-2 bg-yellow-50 rounded text-xs text-yellow-800">
            Graph editing is disabled during algorithm execution
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GraphEditor;
