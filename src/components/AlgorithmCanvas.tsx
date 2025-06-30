
import React, { useRef, useEffect } from 'react';

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

interface AlgorithmCanvasProps {
  algorithm: string;
  graphData: GraphData;
  currentState: any;
  startNode: string;
  targetNode: string;
}

const AlgorithmCanvas = ({ 
  algorithm, 
  graphData, 
  currentState, 
  startNode, 
  targetNode 
}: AlgorithmCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw edges
    graphData.edges.forEach(edge => {
      const fromNode = graphData.nodes.find(n => n.id === edge.from);
      const toNode = graphData.nodes.find(n => n.id === edge.to);
      
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        
        // Color based on algorithm state
        if (currentState?.exploredEdges?.includes(`${edge.from}-${edge.to}`)) {
          ctx.strokeStyle = '#3b82f6'; // Blue for explored
          ctx.lineWidth = 3;
        } else if (currentState?.currentPath?.includes(edge.from) && 
                   currentState?.currentPath?.includes(edge.to)) {
          ctx.strokeStyle = '#ef4444'; // Red for current path
          ctx.lineWidth = 3;
        } else {
          ctx.strokeStyle = '#d1d5db'; // Gray for unexplored
          ctx.lineWidth = 2;
        }
        
        ctx.stroke();

        // Draw edge weight
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.fillStyle = '#374151';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(edge.weight.toString(), midX, midY - 5);
      }
    });

    // Draw nodes
    graphData.nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      
      // Color based on node state
      if (node.id === startNode) {
        ctx.fillStyle = '#10b981'; // Green for start
      } else if (node.id === targetNode) {
        ctx.fillStyle = '#ef4444'; // Red for target
      } else if (currentState?.currentNode === node.id) {
        ctx.fillStyle = '#f59e0b'; // Yellow for current
      } else if (currentState?.exploredNodes?.includes(node.id)) {
        ctx.fillStyle = '#3b82f6'; // Blue for explored
      } else if (currentState?.prunedNodes?.includes(node.id)) {
        ctx.fillStyle = '#6b7280'; // Gray for pruned
      } else {
        ctx.fillStyle = '#e5e7eb'; // Light gray for unvisited
      }
      
      ctx.fill();
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw node label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(node.id, node.x, node.y + 5);

      // Draw node value for minimax/alpha-beta
      if ((algorithm === 'minimax' || algorithm === 'alphabeta') && currentState?.nodeValues?.[node.id] !== undefined) {
        ctx.fillStyle = '#374151';
        ctx.font = '10px Arial';
        ctx.fillText(currentState.nodeValues[node.id].toString(), node.x, node.y - 25);
      }
    });

    // Draw legend
    drawLegend(ctx, algorithm, canvas.width, canvas.height);

  }, [graphData, currentState, startNode, targetNode, algorithm]);

  const drawLegend = (ctx: CanvasRenderingContext2D, algorithm: string, width: number, height: number) => {
    const legendItems = [
      { color: '#10b981', label: 'Start Node' },
      { color: '#ef4444', label: 'Target Node' },
      { color: '#f59e0b', label: 'Current Node' },
      { color: '#3b82f6', label: 'Explored' },
    ];

    if (algorithm === 'alphabeta') {
      legendItems.push({ color: '#6b7280', label: 'Pruned' });
    }

    const legendX = width - 120;
    const legendY = 20;

    legendItems.forEach((item, index) => {
      const y = legendY + index * 25;
      
      // Draw color box
      ctx.fillStyle = item.color;
      ctx.fillRect(legendX, y, 15, 15);
      
      // Draw label
      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, legendX + 20, y + 12);
    });
  };

  return (
    <div className="w-full h-96 bg-white rounded-lg border">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
};

export default AlgorithmCanvas;
