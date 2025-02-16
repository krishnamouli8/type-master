import React, { useState, useEffect, useCallback } from 'react';
import { Timer, RefreshCw } from 'lucide-react';
import Navbar from './Navbar';
import { StatItemProps } from './types';

const sampleText = `The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do. The best way to predict the future is to invent it. Innovation distinguishes between a leader and a follower. Technology is best when it brings people together.`;

const StatItem: React.FC<StatItemProps> = ({ value, label }) => (
  <div className="p-4 rounded-2xl border border-gray-700 bg-gray-800">
    <div className="text-2xl font-bold text-amber-300">{value}</div>
    <div className="text-amber-200">{label}</div>
  </div>
);

const TypingTest: React.FC = () => {
  const [timeLimit, setTimeLimit] = useState<number>(60);
  const [timeRemaining, setTimeRemaining] = useState<number>(timeLimit);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [errors, setErrors] = useState<number>(0);
  const [started, setStarted] = useState<boolean>(false);
  const [finished, setFinished] = useState<boolean>(false);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const resetTest = useCallback(() => {
    setCurrentInput('');
    setWordCount(0);
    setAccuracy(100);
    setErrors(0);
    setTotalErrors(0);
    setStarted(false);
    setFinished(false);
    setTimeRemaining(timeLimit);
    setTotalKeystrokes(0);
    setCursorPosition(0);
  }, [timeLimit]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (started && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setFinished(true);
            setStarted(false);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [started, timeRemaining]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    const prevInput = currentInput;
    
    if (!started && inputValue.length === 1) {
      setStarted(true);
    }

    setCurrentInput(inputValue);
    setCursorPosition(inputValue.length - 1);
    setTotalKeystrokes((prev) => prev + 1);

    if (inputValue.length > prevInput.length) {
      const newChar = inputValue[inputValue.length - 1];
      const expectedChar = sampleText[inputValue.length - 1];
      if (newChar !== expectedChar) {
        setTotalErrors(prev => prev + 1);
      }
    }

    let currentErrors = 0;
    for (let i = 0; i < inputValue.length; i++) {
      if (inputValue[i] !== sampleText[i]) {
        currentErrors++;
      }
    }
    setErrors(currentErrors);

    const accuracyPercentage = ((totalKeystrokes - totalErrors) / totalKeystrokes) * 100;
    setAccuracy(Math.max(0, Math.min(100, accuracyPercentage)));

    const words = inputValue.trim().split(/\s+/).length;
    const minutes = (timeLimit - timeRemaining) / 60;
    if (minutes > 0) {
      setWordCount(Math.round(words / minutes));
    }
  };

  const renderText = () => {
    return (
      <div className="relative font-mono">
        {sampleText.split('').map((char, index) => {
          let color = 'text-gray-500';
          if (index < currentInput.length) {
            color = currentInput[index] === char 
              ? 'text-amber-300'
              : 'text-red-500'; // Changed from amber-700 to red-500 for errors
          }
          return (
            <span
              key={index}
              className={`${color} transition-colors duration-150`}
            >
              {char}
              {index === cursorPosition && started && !finished && (
                <span className="absolute w-0.5 h-6 -mt-1 animate-pulse bg-amber-400" />
              )}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <Navbar />
      <div className="pt-24 pb-12 px-4 min-h-screen flex flex-col">
        {/* Adjusted button layout to bring them closer together */}
        <div className="flex justify-center items-center gap-4 mb-8">
          {/* Reset Button */}
          <button
            onClick={resetTest}
            className="px-4 py-2 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 bg-gray-700 text-amber-300 hover:bg-gray-600"
          >
            <RefreshCw size={16} /> Reset
          </button>

          {/* Time Limit Dropdown */}
          <select
            className="px-4 py-2 rounded-xl transition-colors duration-300 text-center appearance-none bg-gray-700 text-amber-300 border-gray-600 hover:border-gray-500"
            value={timeLimit}
            onChange={(e) => {
              setTimeLimit(Number(e.target.value));
              resetTest();
            }}
          >
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="120">2 minutes</option>
            <option value="300">5 minutes</option>
          </select>

          {/* Timer Display */}
          <div className="flex items-center justify-center gap-2 text-lg font-semibold px-4 py-2 rounded-xl transition-colors duration-300 bg-gray-700 text-amber-300">
            <Timer size={20} />
            <span>{timeRemaining}s</span>
          </div>
        </div>

        {/* Main content area - conditionally render typing or results */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {!finished ? (
            <div className="w-full max-w-4xl">
              <div className="mb-6 text-lg leading-relaxed">
                {renderText()}
              </div>
              
              <textarea
                className="w-full p-6 rounded-2xl outline-none transition-all duration-300 bg-gray-900/80 border-gray-700 focus:border-gray-600 focus:ring-2 focus:ring-gray-700 text-amber-200"
                value={currentInput}
                onChange={handleInput}
                placeholder="Start typing..."
                disabled={finished}
                rows={4}
              />
            </div>
          ) : (
            <div 
              className="text-center p-8 rounded-2xl border transition-opacity duration-1000 opacity-100 bg-gray-900/50 border-gray-700 w-full max-w-4xl"
            >
              <h2 className="text-3xl font-bold mb-6 text-amber-300">Time's Up!</h2>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: wordCount, label: 'Words Per Minute' },
                  { value: `${accuracy.toFixed(1)}%`, label: 'Accuracy' },
                  { value: totalErrors, label: 'Total Errors' }
                ].map((stat, index) => (
                  <StatItem
                    key={index}
                    value={stat.value}
                    label={stat.label}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TypingTest;