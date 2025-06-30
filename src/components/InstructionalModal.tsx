
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BookOpen, Play, Settings, BarChart3 } from 'lucide-react';

interface InstructionalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionalModal = ({ isOpen, onClose }: InstructionalModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Welcome to DSA Visualizer</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Getting Started</h3>
            <p className="text-gray-600 text-sm">
              This tool helps you understand core AI search algorithms through interactive visualization. 
              Select an algorithm from the main menu to begin exploring its behavior.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Play className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">Interactive Controls</h4>
                  <p className="text-xs text-gray-600">
                    Use play, pause, step, and speed controls to explore algorithms at your own pace.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Settings className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">Customizable Input</h4>
                  <p className="text-xs text-gray-600">
                    Edit graphs, set start/end nodes, and adjust parameters to test different scenarios.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BarChart3 className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">Performance Metrics</h4>
                  <p className="text-xs text-gray-600">
                    Monitor execution time, memory usage, and node exploration in real-time.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">Educational Focus</h4>
                  <p className="text-xs text-gray-600">
                    Built for undergraduate AI courses with comprehensive learning support.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Available Algorithms</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-blue-800">• Depth-First Search (DFS)</div>
              <div className="text-blue-800">• Breadth-First Search (BFS)</div>
              <div className="text-blue-800">• Minimax Algorithm</div>
              <div className="text-blue-800">• Alpha-Beta Pruning</div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>
            Start Exploring
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionalModal;
