
import { useState, useEffect, useRef, useCallback } from 'react';

interface SortingState {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  currentStep: number;
}

export const useSortingAlgorithm = (
  algorithm: string,
  initialArray: number[],
  speed: number
) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentState, setCurrentState] = useState<SortingState>({
    array: [...initialArray],
    comparing: [],
    swapping: [],
    sorted: [],
    currentStep: 0
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const stepsRef = useRef<SortingState[]>([]);
  const currentStepRef = useRef(0);

  const generateSteps = useCallback((arr: number[], sortingAlgorithm: string) => {
    const steps: SortingState[] = [];
    const array = [...arr];
    
    const addStep = (comparing: number[] = [], swapping: number[] = [], sorted: number[] = []) => {
      steps.push({
        array: [...array],
        comparing,
        swapping,
        sorted,
        currentStep: steps.length
      });
    };

    switch (sortingAlgorithm) {
      case 'bubble':
        bubbleSort(array, addStep);
        break;
      case 'insertion':
        insertionSort(array, addStep);
        break;
      case 'selection':
        selectionSort(array, addStep);
        break;
      case 'quick':
        quickSort(array, 0, array.length - 1, addStep);
        break;
      default:
        bubbleSort(array, addStep);
        break;
    }

    return steps;
  }, []);

  const bubbleSort = (arr: number[], addStep: Function) => {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        addStep([j, j + 1]);
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          addStep([], [j, j + 1]);
        }
      }
      addStep([], [], [n - 1 - i]);
    }
    addStep([], [], [...Array(n).keys()]);
  };

  const insertionSort = (arr: number[], addStep: Function) => {
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      addStep([i]);
      
      while (j >= 0 && arr[j] > key) {
        addStep([j, j + 1]);
        arr[j + 1] = arr[j];
        addStep([], [j, j + 1]);
        j--;
      }
      arr[j + 1] = key;
      addStep([], [], [...Array(i + 1).keys()]);
    }
    addStep([], [], [...Array(arr.length).keys()]);
  };

  const selectionSort = (arr: number[], addStep: Function) => {
    for (let i = 0; i < arr.length - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < arr.length; j++) {
        addStep([j, minIdx]);
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        addStep([], [i, minIdx]);
      }
      addStep([], [], [i]);
    }
    addStep([], [], [...Array(arr.length).keys()]);
  };

  const quickSort = (arr: number[], low: number, high: number, addStep: Function) => {
    if (low < high) {
      const pi = partition(arr, low, high, addStep);
      quickSort(arr, low, pi - 1, addStep);
      quickSort(arr, pi + 1, high, addStep);
    }
  };

  const partition = (arr: number[], low: number, high: number, addStep: Function) => {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      addStep([j, high]);
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        addStep([], [i, j]);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    addStep([], [i + 1, high]);
    return i + 1;
  };

  const start = useCallback(() => {
    if (isComplete) return;
    setIsRunning(true);
    
    intervalRef.current = setInterval(() => {
      if (currentStepRef.current < stepsRef.current.length - 1) {
        currentStepRef.current++;
        setCurrentState(stepsRef.current[currentStepRef.current]);
      } else {
        setIsComplete(true);
        setIsRunning(false);
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    }, speed);
  }, [isComplete, speed]);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const step = useCallback(() => {
    if (currentStepRef.current < stepsRef.current.length - 1) {
      currentStepRef.current++;
      setCurrentState(stepsRef.current[currentStepRef.current]);
    } else {
      setIsComplete(true);
    }
  }, []);

  const reset = useCallback(() => {
    pause();
    setIsComplete(false);
    currentStepRef.current = 0;
    stepsRef.current = generateSteps(initialArray, algorithm);
    if (stepsRef.current.length > 0) {
      setCurrentState(stepsRef.current[0]);
    }
  }, [algorithm, initialArray, generateSteps, pause]);

  useEffect(() => {
    reset();
  }, [algorithm, initialArray]);

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
    start,
    pause,
    reset,
    step
  };
};
