import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AlgorithmVisualizer from '@/components/AlgorithmVisualizer';
import SortingVisualizer from '@/components/SortingVisualizer';
import InstructionalModal from '@/components/InstructionalModal';
import { BookOpen, Play, BarChart3, Download } from 'lucide-react';

const Index = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<'search' | 'sorting' | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const searchAlgorithms = [
    {
      id: 'dfs',
      name: 'Depth-First Search',
      description: 'Explores graph by going as deep as possible before backtracking',
      complexity: 'O(V + E)',
      category: 'Graph Traversal'
    },
    {
      id: 'bfs',
      name: 'Breadth-First Search',
      description: 'Explores graph level by level using a queue',
      complexity: 'O(V + E)',
      category: 'Graph Traversal'
    },
    {
      id: 'minimax',
      name: 'Minimax Algorithm',
      description: 'Game theory algorithm for decision making in two-player games',
      complexity: 'O(b^d)',
      category: 'Game Theory'
    },
    {
      id: 'alphabeta',
      name: 'Alpha-Beta Pruning',
      description: 'Optimized minimax that prunes unnecessary branches',
      complexity: 'O(b^(d/2))',
      category: 'Game Theory'
    }
  ];

  const sortingAlgorithms = [
    'Bubble Sort', 'Insertion Sort', 'Selection Sort', 'Merge Sort', 'Quick Sort',
    'Heap Sort', 'Shell Sort', 'Radix Sort', 'Counting Sort', 'Cocktail Sort'
  ];

  if (selectedModule === 'sorting') {
    return <SortingVisualizer />;
  }

  if (selectedAlgorithm) {
    return (
      <AlgorithmVisualizer 
        algorithm={selectedAlgorithm}
        onBack={() => {
          setSelectedAlgorithm(null);
          setSelectedModule(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <InstructionalModal 
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
      
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DSA Visualizer</h1>
                <p className="text-sm text-gray-600">Interactive AI Search & Sorting Algorithms</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowInstructions(true)}
              className="flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Instructions</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Select a Module to Explore
          </h2>
          <p className="text-gray-600">
            Choose between AI search algorithms or sorting algorithms visualization.
          </p>
        </div>

        {/* Module Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card 
            className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 hover:border-blue-200"
            onClick={() => setSelectedModule('search')}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  AI Search Algorithms
                </h3>
                <Badge variant="secondary" className="text-xs">
                  Graph Traversal & Game Theory
                </Badge>
              </div>
              <Play className="w-5 h-5 text-blue-600" />
            </div>
            
            <p className="text-gray-600 text-sm mb-4">
              Explore DFS, BFS, Minimax, and Alpha-Beta Pruning algorithms with interactive graph visualization.
            </p>
            
            <Button size="sm" className="text-xs">
              Start Search Algorithms
            </Button>
          </Card>

          <Card 
            className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 hover:border-blue-200"
            onClick={() => setSelectedModule('sorting')}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Sorting Algorithms
                </h3>
                <Badge variant="secondary" className="text-xs">
                  10 Different Algorithms
                </Badge>
              </div>
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            
            <p className="text-gray-600 text-sm mb-4">
              Visualize {sortingAlgorithms.length} sorting algorithms with animated bar charts and step-by-step execution.
            </p>
            
            <Button size="sm" className="text-xs">
              Start Sorting Algorithms
            </Button>
          </Card>
        </div>

        {/* Search Algorithms Grid */}
        {selectedModule === 'search' && (
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI Search Algorithms
              </h3>
              <Button
                variant="outline"
                onClick={() => setSelectedModule(null)}
                className="mb-4"
              >
                ← Back to Modules
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {searchAlgorithms.map((algorithm) => (
                <Card 
                  key={algorithm.id}
                  className="p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 hover:border-blue-200"
                  onClick={() => setSelectedAlgorithm(algorithm.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {algorithm.name}
                      </h3>
                      <Badge variant="secondary" className="text-xs">
                        {algorithm.category}
                      </Badge>
                    </div>
                    <Play className="w-5 h-5 text-blue-600" />
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {algorithm.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Complexity:</span> {algorithm.complexity}
                    </div>
                    <Button size="sm" className="text-xs">
                      Start Visualization
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Play className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Interactive Controls</h3>
            <p className="text-sm text-gray-600">
              Step through algorithms, adjust speed, and control execution flow
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Performance Analytics</h3>
            <p className="text-sm text-gray-600">
              Real-time metrics including execution time and node exploration
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Download className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Export & Analysis</h3>
            <p className="text-sm text-gray-600">
              Export session data and performance logs for further analysis
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
