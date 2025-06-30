
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, RotateCcw, SkipForward, Shuffle } from 'lucide-react';
import { useSortingAlgorithm } from '@/hooks/useSortingAlgorithm';

const SortingVisualizer = () => {
  const [algorithm, setAlgorithm] = useState('bubble');
  const [arraySize, setArraySize] = useState(20);
  const [speed, setSpeed] = useState(100);
  const [array, setArray] = useState<number[]>([]);
  
  const {
    isRunning,
    isComplete,
    currentState,
    start,
    pause,
    reset,
    step
  } = useSortingAlgorithm(algorithm, array, speed);

  const algorithms = [
    { id: 'bubble', name: 'Bubble Sort' },
    { id: 'insertion', name: 'Insertion Sort' },
    { id: 'selection', name: 'Selection Sort' },
    { id: 'merge', name: 'Merge Sort' },
    { id: 'quick', name: 'Quick Sort' },
    { id: 'heap', name: 'Heap Sort' },
    { id: 'shell', name: 'Shell Sort' },
    { id: 'radix', name: 'Radix Sort' },
    { id: 'counting', name: 'Counting Sort' },
    { id: 'cocktail', name: 'Cocktail Sort' }
  ];

  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 300) + 10
    );
    setArray(newArray);
  };

  useEffect(() => {
    generateRandomArray();
  }, [arraySize]);

  const renderBars = () => {
    const displayArray = currentState?.array || array;
    const maxValue = Math.max(...displayArray);
    
    return (
      <div className="flex items-end justify-center h-64 space-x-1 p-4">
        {displayArray.map((value: number, index: number) => (
          <div
            key={index}
            className={`flex-1 transition-all duration-200 ${
              currentState?.comparing?.includes(index) 
                ? 'bg-red-500' 
                : currentState?.swapping?.includes(index)
                  ? 'bg-yellow-500'
                  : currentState?.sorted?.includes(index)
                    ? 'bg-green-500'
                    : 'bg-blue-400'
            }`}
            style={{
              height: `${(value / maxValue) * 200}px`,
              minHeight: '4px'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Sorting Algorithms Visualizer
          </h1>
          <p className="text-gray-600">
            Interactive visualization of fundamental sorting algorithms
          </p>
        </header>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Algorithm</label>
                  <Select value={algorithm} onValueChange={setAlgorithm}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {algorithms.map(alg => (
                        <SelectItem key={alg.id} value={alg.id}>
                          {alg.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Array Size: {arraySize}
                  </label>
                  <Slider
                    value={[arraySize]}
                    onValueChange={(value) => setArraySize(value[0])}
                    min={10}
                    max={100}
                    step={5}
                    disabled={isRunning}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Speed: {speed}ms
                  </label>
                  <Slider
                    value={[speed]}
                    onValueChange={(value) => setSpeed(value[0])}
                    min={10}
                    max={500}
                    step={10}
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={isRunning ? pause : start}
                    disabled={isComplete}
                    className="w-full"
                  >
                    {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                    {isRunning ? 'Pause' : 'Start'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={step}
                    disabled={isRunning || isComplete}
                    className="w-full"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Step
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={reset}
                    className="w-full"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={generateRandomArray}
                    disabled={isRunning}
                    className="w-full"
                  >
                    <Shuffle className="w-4 h-4 mr-2" />
                    Shuffle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  {algorithms.find(a => a.id === algorithm)?.name} Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderBars()}
                <div className="mt-4 text-center">
                  <div className="flex justify-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-blue-400"></div>
                      <span>Unsorted</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-red-500"></div>
                      <span>Comparing</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-yellow-500"></div>
                      <span>Swapping</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-4 h-4 bg-green-500"></div>
                      <span>Sorted</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;
