
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Network, List, Grid } from 'lucide-react';

interface GraphData {
  nodes: Array<{ id: string; x: number; y: number; value: number }>;
  edges: Array<{ from: string; to: string; weight: number }>;
}

interface GraphRepresentationToggleProps {
  graphData: GraphData;
  currentView: 'graph' | 'adjacency' | 'matrix';
  onViewChange: (view: 'graph' | 'adjacency' | 'matrix') => void;
}

const GraphRepresentationToggle = ({ 
  graphData, 
  currentView, 
  onViewChange 
}: GraphRepresentationToggleProps) => {
  const buildAdjacencyList = () => {
    const adjList: { [key: string]: string[] } = {};
    graphData.nodes.forEach(node => {
      adjList[node.id] = [];
    });
    graphData.edges.forEach(edge => {
      adjList[edge.from].push(edge.to);
      adjList[edge.to].push(edge.from);
    });
    return adjList;
  };

  const buildAdjacencyMatrix = () => {
    const nodeIds = graphData.nodes.map(n => n.id).sort();
    const matrix: number[][] = Array(nodeIds.length).fill(0).map(() => Array(nodeIds.length).fill(0));
    
    graphData.edges.forEach(edge => {
      const fromIndex = nodeIds.indexOf(edge.from);
      const toIndex = nodeIds.indexOf(edge.to);
      if (fromIndex !== -1 && toIndex !== -1) {
        matrix[fromIndex][toIndex] = edge.weight;
        matrix[toIndex][fromIndex] = edge.weight; // Undirected graph
      }
    });
    
    return { matrix, nodeIds };
  };

  const renderAdjacencyList = () => {
    const adjList = buildAdjacencyList();
    return (
      <div className="space-y-2">
        {Object.entries(adjList).map(([node, neighbors]) => (
          <div key={node} className="flex items-center space-x-2">
            <span className="font-medium min-w-8">{node}:</span>
            <span className="text-gray-600">[{neighbors.join(', ')}]</span>
          </div>
        ))}
      </div>
    );
  };

  const renderAdjacencyMatrix = () => {
    const { matrix, nodeIds } = buildAdjacencyMatrix();
    return (
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              {nodeIds.map(id => (
                <TableHead key={id} className="text-center">{id}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {matrix.map((row, i) => (
              <TableRow key={nodeIds[i]}>
                <TableCell className="font-medium">{nodeIds[i]}</TableCell>
                {row.map((cell, j) => (
                  <TableCell key={j} className="text-center">
                    {cell === 0 ? '0' : cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Graph Representation</CardTitle>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant={currentView === 'graph' ? 'default' : 'outline'}
            onClick={() => onViewChange('graph')}
            className="flex items-center space-x-1"
          >
            <Network className="w-4 h-4" />
            <span>Graph</span>
          </Button>
          <Button
            size="sm"
            variant={currentView === 'adjacency' ? 'default' : 'outline'}
            onClick={() => onViewChange('adjacency')}
            className="flex items-center space-x-1"
          >
            <List className="w-4 h-4" />
            <span>Adjacency List</span>
          </Button>
          <Button
            size="sm"
            variant={currentView === 'matrix' ? 'default' : 'outline'}
            onClick={() => onViewChange('matrix')}
            className="flex items-center space-x-1"
          >
            <Grid className="w-4 h-4" />
            <span>Matrix</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {currentView === 'adjacency' && renderAdjacencyList()}
        {currentView === 'matrix' && renderAdjacencyMatrix()}
        {currentView === 'graph' && (
          <div className="text-center text-gray-500 py-4">
            Graph view is displayed in the main canvas above
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GraphRepresentationToggle;
