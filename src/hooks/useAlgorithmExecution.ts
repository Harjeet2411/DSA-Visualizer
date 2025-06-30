
import { useState, useEffect, useCallback, useRef } from 'react';

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

interface AlgorithmState {
  currentNode: string | null;
  exploredNodes: string[];
  exploredEdges: string[];
  currentPath: string[];
  prunedNodes?: string[];
  nodeValues?: { [key: string]: number };
  stack?: string[];
  queue?: string[];
}

interface PerformanceMetrics {
  executionTime: number;
  nodesExplored: number;
  totalNodes: number;
  memoryUsage: number;
  stepCount: number;
  isComplete: boolean;
}

export const useAlgorithmExecution = (
  algorithm: string,
  graphData: GraphData,
  startNode: string,
  targetNode: string,
  speed: number
) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentState, setCurrentState] = useState<AlgorithmState>({
    currentNode: null,
    exploredNodes: [],
    exploredEdges: [],
    currentPath: [],
    prunedNodes: [],
    nodeValues: {},
    stack: [],
    queue: []
  });
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    executionTime: 0,
    nodesExplored: 0,
    totalNodes: graphData.nodes.length,
    memoryUsage: 0,
    stepCount: 0,
    isComplete: false
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const algorithmStateRef = useRef<any>({});

  const buildAdjacencyList = useCallback(() => {
    const adjList: { [key: string]: string[] } = {};
    graphData.nodes.forEach(node => {
      adjList[node.id] = [];
    });
    graphData.edges.forEach(edge => {
      adjList[edge.from].push(edge.to);
      adjList[edge.to].push(edge.from); // For undirected graph
    });
    return adjList;
  }, [graphData]);

  const initializeDFS = useCallback(() => {
    const adjList = buildAdjacencyList();
    algorithmStateRef.current = {
      stack: [startNode],
      visited: new Set(),
      path: [],
      adjList,
      targetFound: false
    };
  }, [startNode, buildAdjacencyList]);

  const initializeBFS = useCallback(() => {
    const adjList = buildAdjacencyList();
    algorithmStateRef.current = {
      queue: [startNode],
      visited: new Set(),
      path: [],
      adjList,
      targetFound: false
    };
  }, [startNode, buildAdjacencyList]);

  const initializeMinimax = useCallback(() => {
    // Simple game tree for demonstration
    const gameTree: { [key: string]: { children: string[], value?: number, isMaxPlayer?: boolean } } = {};
    graphData.nodes.forEach(node => {
      const children = graphData.edges
        .filter(edge => edge.from === node.id)
        .map(edge => edge.to);
      gameTree[node.id] = {
        children,
        value: node.value,
        isMaxPlayer: node.id === startNode
      };
    });

    algorithmStateRef.current = {
      gameTree,
      nodeValues: {},
      currentNode: startNode,
      isMaxPlayer: true
    };
  }, [graphData, startNode]);

  const stepDFS = useCallback(() => {
    const state = algorithmStateRef.current;
    if (state.stack.length === 0 || state.targetFound) {
      setIsComplete(true);
      return false;
    }

    const currentNode = state.stack.pop();
    if (state.visited.has(currentNode)) {
      return true;
    }

    state.visited.add(currentNode);
    state.path.push(currentNode);

    setCurrentState(prev => ({
      ...prev,
      currentNode,
      exploredNodes: Array.from(state.visited),
      currentPath: [...state.path],
      stack: [...state.stack]
    }));

    if (currentNode === targetNode) {
      state.targetFound = true;
      setIsComplete(true);
      return false;
    }

    const neighbors = state.adjList[currentNode] || [];
    neighbors.reverse().forEach((neighbor: string) => {
      if (!state.visited.has(neighbor)) {
        state.stack.push(neighbor);
      }
    });

    return true;
  }, [targetNode]);

  const stepBFS = useCallback(() => {
    const state = algorithmStateRef.current;
    if (state.queue.length === 0 || state.targetFound) {
      setIsComplete(true);
      return false;
    }

    const currentNode = state.queue.shift();
    if (state.visited.has(currentNode)) {
      return true;
    }

    state.visited.add(currentNode);
    state.path.push(currentNode);

    setCurrentState(prev => ({
      ...prev,
      currentNode,
      exploredNodes: Array.from(state.visited),
      currentPath: [...state.path],
      queue: [...state.queue]
    }));

    if (currentNode === targetNode) {
      state.targetFound = true;
      setIsComplete(true);
      return false;
    }

    const neighbors = state.adjList[currentNode] || [];
    neighbors.forEach((neighbor: string) => {
      if (!state.visited.has(neighbor)) {
        state.queue.push(neighbor);
      }
    });

    return true;
  }, [targetNode]);

  const stepMinimax = useCallback(() => {
    const state = algorithmStateRef.current;
    // Simplified minimax demonstration
    const nodeValue = Math.floor(Math.random() * 20) - 10;
    state.nodeValues[state.currentNode] = nodeValue;

    setCurrentState(prev => ({
      ...prev,
      currentNode: state.currentNode,
      nodeValues: { ...state.nodeValues }
    }));

    // Move to next node (simplified)
    const children = state.gameTree[state.currentNode]?.children || [];
    if (children.length > 0) {
      state.currentNode = children[0];
      return true;
    } else {
      setIsComplete(true);
      return false;
    }
  }, []);

  const stepAlphaBeta = useCallback(() => {
    const state = algorithmStateRef.current;
    // Simplified alpha-beta with pruning demonstration
    const nodeValue = Math.floor(Math.random() * 20) - 10;
    state.nodeValues[state.currentNode] = nodeValue;

    // Simulate pruning
    const shouldPrune = Math.random() > 0.7;
    if (shouldPrune) {
      const prunedNodes = [...(currentState.prunedNodes || []), state.currentNode];
      setCurrentState(prev => ({
        ...prev,
        currentNode: state.currentNode,
        nodeValues: { ...state.nodeValues },
        prunedNodes
      }));
    } else {
      setCurrentState(prev => ({
        ...prev,
        currentNode: state.currentNode,
        nodeValues: { ...state.nodeValues }
      }));
    }

    // Move to next node (simplified)
    const children = state.gameTree[state.currentNode]?.children || [];
    if (children.length > 0 && !shouldPrune) {
      state.currentNode = children[0];
      return true;
    } else {
      setIsComplete(true);
      return false;
    }
  }, [currentState.prunedNodes]);

  const step = useCallback(() => {
    if (isComplete) return;

    const startTime = performance.now();
    let shouldContinue = false;

    switch (algorithm) {
      case 'dfs':
        shouldContinue = stepDFS();
        break;
      case 'bfs':
        shouldContinue = stepBFS();
        break;
      case 'minimax':
        shouldContinue = stepMinimax();
        break;
      case 'alphabeta':
        shouldContinue = stepAlphaBeta();
        break;
    }

    const endTime = performance.now();
    const stepTime = endTime - startTime;

    setMetrics(prev => ({
      ...prev,
      executionTime: prev.executionTime + stepTime,
      nodesExplored: currentState.exploredNodes.length,
      totalNodes: graphData.nodes.length,
      memoryUsage: Math.floor(Math.random() * 100) + 50, // Simulated
      stepCount: prev.stepCount + 1,
      isComplete: !shouldContinue
    }));

    if (!shouldContinue) {
      setIsRunning(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [algorithm, isComplete, stepDFS, stepBFS, stepMinimax, stepAlphaBeta, currentState.exploredNodes.length, graphData.nodes.length]);

  const start = useCallback(() => {
    if (isComplete) return;
    
    setIsRunning(true);
    startTimeRef.current = performance.now();

    intervalRef.current = setInterval(() => {
      step();
    }, speed);
  }, [isComplete, step, speed]);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    pause();
    setIsComplete(false);
    setCurrentState({
      currentNode: null,
      exploredNodes: [],
      exploredEdges: [],
      currentPath: [],
      prunedNodes: [],
      nodeValues: {},
      stack: [],
      queue: []
    });
    setMetrics({
      executionTime: 0,
      nodesExplored: 0,
      totalNodes: graphData.nodes.length,
      memoryUsage: 0,
      stepCount: 0,
      isComplete: false
    });

    // Reinitialize algorithm state
    switch (algorithm) {
      case 'dfs':
        initializeDFS();
        break;
      case 'bfs':
        initializeBFS();
        break;
      case 'minimax':
      case 'alphabeta':
        initializeMinimax();
        break;
    }
  }, [algorithm, graphData.nodes.length, initializeDFS, initializeBFS, initializeMinimax, pause]);

  // Initialize algorithm on mount or algorithm change
  useEffect(() => {
    reset();
  }, [algorithm, startNode, targetNode, graphData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isRunning,
    isComplete,
    currentState,
    metrics: {
      ...metrics,
      totalNodes: graphData.nodes.length
    },
    start,
    pause,
    reset,
    step
  };
};
