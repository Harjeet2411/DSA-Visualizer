
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Download, Clock, Activity, Zap } from 'lucide-react';

interface PerformanceMetrics {
  executionTime: number;
  nodesExplored: number;
  totalNodes: number;
  memoryUsage: number;
  stepCount: number;
  isComplete: boolean;
}

interface PerformancePanelProps {
  metrics: PerformanceMetrics;
}

const PerformancePanel = ({ metrics }: PerformancePanelProps) => {
  const exportData = () => {
    const sessionData = {
      timestamp: new Date().toISOString(),
      metrics: metrics,
      session_id: Math.random().toString(36).substr(2, 9)
    };

    const dataStr = JSON.stringify(sessionData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `dsa_session_${sessionData.session_id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Execution Time (ms)', metrics.executionTime.toString()],
      ['Nodes Explored', metrics.nodesExplored.toString()],
      ['Total Nodes', metrics.totalNodes.toString()],
      ['Memory Usage (KB)', metrics.memoryUsage.toString()],
      ['Step Count', metrics.stepCount.toString()],
      ['Completion Status', metrics.isComplete ? 'Complete' : 'In Progress']
    ];

    const csvString = csvData.map(row => row.join(',')).join('\n');
    const dataBlob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `dsa_metrics_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="w-5 h-5" />
          <span>Performance Analytics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Real-time Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-800">Time</span>
            </div>
            <div className="text-lg font-bold text-blue-900">
              {metrics.executionTime}ms
            </div>
          </div>

          <div className="bg-green-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Activity className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-800">Nodes</span>
            </div>
            <div className="text-lg font-bold text-green-900">
              {metrics.nodesExplored}/{metrics.totalNodes}
            </div>
          </div>

          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <Zap className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-800">Memory</span>
            </div>
            <div className="text-lg font-bold text-purple-900">
              {metrics.memoryUsage}KB
            </div>
          </div>

          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-1">
              <BarChart3 className="w-4 h-4 text-orange-600" />
              <span className="text-xs font-medium text-orange-800">Steps</span>
            </div>
            <div className="text-lg font-bold text-orange-900">
              {metrics.stepCount}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <Badge 
            variant={metrics.isComplete ? "default" : "secondary"}
            className="px-3 py-1"
          >
            {metrics.isComplete ? "Algorithm Complete" : "Running..."}
          </Badge>
        </div>

        {/* Export Controls */}
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportData}
            className="w-full flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportCSV}
            className="w-full flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
        </div>

        {/* Efficiency Indicators */}
        <div className="pt-2 border-t">
          <div className="text-xs text-gray-600 mb-2">Exploration Efficiency</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((metrics.nodesExplored / metrics.totalNodes) * 100, 100)}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {Math.round((metrics.nodesExplored / metrics.totalNodes) * 100)}% nodes explored
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformancePanel;
