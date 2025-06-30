
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import GraphEditor from './GraphEditor';
import PerformancePanel from './PerformancePanel';
import AlgorithmCanvas from './AlgorithmCanvas';
import ControlPanel from './ControlPanel';
import StepExplanationPanel from './StepExplanationPanel';
import ExplorationTable from './ExplorationTable';
import MathCalculationsPanel from './MathCalculationsPanel';
import GraphRepresentationToggle from './GraphRepresentationToggle';
import { useAlgorithmExecution } from '@/hooks/useAlgorithmExecution';

interface AlgorithmVisualizerProps {
  algorithm: string;
  onBack: () => void;
}

const AlgorithmVisualizer = ({ algorithm, onBack }: AlgorithmVisualizerProps) => {
  const [graphData, setGraphData] = useState({
    nodes: [
      { id: 'A', x: 100, y: 100, value: 0 },
      { id: 'B', x: 200, y: 50, value: 0 },
      { id: 'C', x: 200, y: 150, value: 0 },
      { id: 'D', x: 300, y: 100, value: 0 }
    ],
    edges: [
      { from: 'A', to: 'B', weight: 1 },
      { from: 'A', to: 'C', weight: 1 },
      { from: 'B', to: 'D', weight: 1 },
      { from: 'C', to: 'D', weight: 1 }
    ]
  });

  const [startNode, setStartNode] = useState('A');
  const [targetNode, setTargetNode] = useState('D');
  const [speed, setSpeed] = useState(500);
  const [graphView, setGraphView] = useState<'graph' | 'adjacency' | 'matrix'>('graph');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const {
    isRunning,
    isComplete,
    currentState,
    metrics,
    start,
    pause,
    reset,
    step
  } = useAlgorithmExecution(algorithm, graphData, startNode, targetNode, speed);

  const algorithmNames = {
    dfs: 'Depth-First Search',
    bfs: 'Breadth-First Search',
    minimax: 'Minimax Algorithm',
    alphabeta: 'Alpha-Beta Pruning'
  };

  // Mock exploration steps data
  const explorationSteps = [
    { step: 1, currentNode: 'A', stackState: ['A'], queueState: ['A'], pathDecision: 'Start node', heuristicValue: 0 },
    { step: 2, currentNode: 'B', stackState: ['B', 'C'], queueState: ['B', 'C'], pathDecision: 'Explore neighbor', heuristicValue: 1 },
    { step: 3, currentNode: 'D', stackState: ['C', 'D'], queueState: ['C', 'D'], pathDecision: 'Found target', heuristicValue: 2 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {algorithmNames[algorithm as keyof typeof algorithmNames]}
              </h1>
              <p className="text-sm text-gray-600">Interactive Algorithm Visualization</p>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={isRunning ? pause : start}
              disabled={isComplete}
              className="flex items-center space-x-2"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Pause' : 'Start'}</span>
            </Button>
            <Button
              variant="outline"
              onClick={step}
              disabled={isRunning || isComplete}
              className="flex items-center space-x-2"
            >
              <SkipForward className="w-4 h-4" />
              <span>Step</span>
            </Button>
            <Button
              variant="outline"
              onClick={reset}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <ControlPanel
              algorithm={algorithm}
              startNode={startNode}
              targetNode={targetNode}
              speed={speed}
              nodes={graphData.nodes}
              onStartNodeChange={setStartNode}
              onTargetNodeChange={setTargetNode}
              onSpeedChange={setSpeed}
            />
            
            <PerformancePanel metrics={metrics} />
          </div>

          {/* Center - Visualization Canvas */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-4">
              <AlgorithmCanvas
                algorithm={algorithm}
                graphData={graphData}
                currentState={currentState}
                startNode={startNode}
                targetNode={targetNode}
              />
            </Card>

            <StepExplanationPanel
              algorithm={algorithm}
              currentStep={currentStepIndex}
              totalSteps={10}
              stepDescription="Exploring current node and adding neighbors to data structure"
              onStepChange={setCurrentStepIndex}
            />
          </div>

          {/* Right Panel - Graph Editor */}
          <div className="lg:col-span-1">
            <GraphEditor
              graphData={graphData}
              onGraphChange={setGraphData}
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Bottom Section - Tables and Analysis */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <ExplorationTable
            algorithm={algorithm}
            steps={explorationSteps}
            currentStep={currentStepIndex}
          />
          
          <MathCalculationsPanel
            algorithm={algorithm}
            currentCalculation={{
              formula: 'f(n) = g(n) + h(n)',
              variables: { 'g(n)': 2, 'h(n)': 3 },
              result: 5,
              explanation: 'Cost function evaluation for current node'
            }}
          />
        </div>

        {/* Graph Representation Toggle */}
        <div className="mt-6">
          <GraphRepresentationToggle
            graphData={graphData}
            currentView={graphView}
            onViewChange={setGraphView}
          />
        </div>
      </div>
    </div>
  );
};

export default AlgorithmVisualizer;
